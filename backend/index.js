const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const ExpensesRoutes = require("./routes/expenseRoutes");
const AiRoutes = require("./routes/summaryRoutes");
const { protect } = require("./middleware/authMiddleware");
const { MONGO_URI, PORT } = require("./utils/config");

const app = express();


app.use(express.json());
app.use(cors());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected using Mongoose"))
  .catch((err) => console.error(err));

// ROUTES -----------------


app.get("/", (req, res) => {
  res.json("Root Api of Tenant App");
});

app.use("/auth", userRoutes);
app.use("/expenses", protect, ExpensesRoutes);
app.use("/summary", protect, AiRoutes);

// ROUTES -----------------

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
