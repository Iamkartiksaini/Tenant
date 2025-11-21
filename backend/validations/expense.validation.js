const { body, validationResult } = require("express-validator");

const EXPENSE_CATEGORIES = [
  "Food",
  "Travel",
  "Utilities",
  "Rent",
  "Groceries",
  "Entertainment",
  "Transport",
  "Other",
];

const expenseValidationRules = [
  // title
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  // category
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(EXPENSE_CATEGORIES)
    .withMessage("Invalid category"),

  // amount
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a number greater than 0"),

  // date
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO date")
    .toDate(),
];

const expenseValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstErrors = {};
    errors.array().forEach((err) => {
      if (!firstErrors[err.path]) {
        firstErrors[err.path] = err.msg;
      }
    });

    return res.status(400).json({ errors: firstErrors });
  }
  next();
};

module.exports = {
  expenseValidationRules,
  expenseValidator,
  EXPENSE_CATEGORIES,
};
