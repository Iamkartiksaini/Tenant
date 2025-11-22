const { GoogleGenAI } = require("@google/genai");
const express = require("express");
const ExpenseModel = require("../models/Expense.model");
const { Api_Erorr_Response, Api_Response } = require("../controllers/response-handler");

const AiRoutes = express.Router();

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

AiRoutes.get("/", async (req, res) => {
  const { startDate, endDate } = req.query;

  let queryStartDate;
  let queryEndDate;

  if (startDate && endDate) {
    queryStartDate = new Date(startDate);
    queryEndDate = new Date(endDate);

    if (isNaN(queryStartDate) || isNaN(queryEndDate)) {
      return res.status(400).json(Api_Erorr_Response({
        message:
          "Invalid date format. Please use ISO 8601 format (e.g., YYYY-MM-DD).",
      }));
    }

    if (queryStartDate >= queryEndDate) {
      return res.status(400).json(Api_Erorr_Response({
        message: "Start date must be strictly before the end date.",
      }));
    }
  } else {
    const today = new Date();
    queryStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
    queryEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of current month

    queryEndDate.setHours(23, 59, 59, 999);
  }

  const matchStage = {
    userId: req.user._id,
    date: {
      $gte: queryStartDate,
      $lte: queryEndDate,
    },
  };

  try {
    const data = await ExpenseModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$category",
          totalCategorySpend: { $sum: "$amount" },
        },
      },
      {
        $sort: { totalCategorySpend: -1 },
      },
    ]);

    if (data.length === 0) {
      return res.json({
        totalSpend: 0,
        topCategory: "N/A",
        aiInsight: "No expenses recorded for this period. Start tracking!",
      });
    }

    const total = data.reduce((sum, e) => sum + e.totalCategorySpend, 0);

    const stats = { total, byCategory: data };

    const summary = await generateAISummary(stats);

    res.status(200).json(
      Api_Response({
        startDate: queryStartDate.toISOString().split("T")[0],
        endDate: queryEndDate.toISOString().split("T")[0],
        totalSpend: total.toFixed(2),
        byCategory: data,
        aiInsight: summary,
      })
    );
  } catch (error) {
    console.error("Error in AI route:", error);
    res
      .status(500)
      .json(
        Api_Erorr_Response({ message: "An internal server error occurred." })
      );
  }
});

async function generateAISummary({ total, byCategory }) {
  const model = "gemini-2.5-flash";

  const instructionPart = {
    text: `You are an AI expense analysis assistant. Analyze the user's provided JSON financial data and generate a **single, brief, and actionable paragraph** (max 3 sentences). The summary must highlight the total spent and the top spending category. Do not include any headings, lists, or markdown formatting.`,
  };

  const dataPart = {
    text: `FINANCIAL DATA: Total spent: ${total} | Spending by category: ${JSON.stringify(
      byCategory
    )}`,
  };

  try {
    const result = await ai.models.generateContent({
      model: model,
      // Contents is an array of parts: Instruction followed by Data
      contents: [instructionPart, dataPart],
    });

    // The result.text property directly holds the string response
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate AI summary due to an API error.";
  }
}

module.exports = AiRoutes;
