const express = require("express");
const Expense = require("../models/Expense.model");
const {
  expenseValidationRules,
  expenseValidator,
} = require("../validations/expense.validation");
const {
  Api_Response,
  Api_Erorr_Response,
} = require("../controllers/response-handler");

const ExpensesRoutes = express.Router();

let maxExpenseLimit = 50;
let minExpenseLimit = 5;

const expenseBodyKeys = {
  title: 1,
  category: 1,
  amount: 1,
  date: 1,
};

ExpensesRoutes.post(
  "/",
  expenseValidationRules,
  expenseValidator,
  async (req, res) => {
    const { title, category, amount, date } = req.body;
    try {
      const newExpense = await Expense.create({
        userId: req.user,
        title,
        category,
        amount,
        date,
      });
      const expense = await Expense.findById(newExpense._id, expenseBodyKeys);
      res.status(201).json(Api_Response(expense));
    } catch (error) {
      res.status(400).json(Api_Erorr_Response({ message: error.message }));
    }
  }
);

ExpensesRoutes.get("/", async (req, res) => {
  try {
    const rawPage = parseInt(req?.query?.page) || 1;
    const rawLimit = parseInt(req?.query?.pageSize) || minExpenseLimit;

    const page = Math.max(1, rawPage);
    const limit = Math.max(
      minExpenseLimit,
      Math.min(rawLimit, maxExpenseLimit)
    );
    const skip = (page - 1) * limit;

    const { startDate, endDate } = req.query;

    // Date Filteration --------------

    let queryStartDate;
    let queryEndDate;

    let dateData = {};
    if (startDate && endDate) {
      queryStartDate = new Date(startDate);
      queryEndDate = new Date(endDate);
      dateData = {
        date: {
          $gte: queryStartDate,
          $lte: queryEndDate,
        },
      };

      if (isNaN(queryStartDate) || isNaN(queryEndDate)) {
        return res.status(400).json(
          Api_Erorr_Response({
            message:
              "Invalid date format. Please use ISO 8601 format (e.g., YYYY-MM-DD).",
          })
        );
      }

      if (queryStartDate >= queryEndDate) {
        return res.status(400).json(
          Api_Erorr_Response({
            message: "Start date must be strictly before the end date.",
          })
        );
      }
    } else {
      // If User not provide date
      // const { start, end } = monthRange();
      // queryStartDate = start;
      // queryEndDate = end;
      dateData = {};
    }

    // Date Filteration --------------

    const ExpenseQuery = {
      userId: req.user._id,
      ...dateData,
    };

    const expenses = await Expense.find(ExpenseQuery, expenseBodyKeys)
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Expense.countDocuments({ userId: req.user });
    const totalPages = Math.ceil(total / limit);
    res.json(
      Api_Response({
        expenses,
        page,
        pages: totalPages,
        total,
      })
    );
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json(Api_Erorr_Response({ message: error.message }));
  }
});

function monthRange(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const start = new Date(year, month, 1);

  const end = new Date(year, month + 1, 0);

  const fmt = (d) => d.toISOString().split("T")[0];

  return { start: fmt(start), end: fmt(end) };
}

module.exports = ExpensesRoutes;
