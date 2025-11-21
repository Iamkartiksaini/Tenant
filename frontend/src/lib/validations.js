import * as yup from "yup";

const passwordSchema = yup
  .string()
  .required("Password is required")
  .min(6, "Password must be at least 6 characters")
  .max(20, "Password must be no more than 20 characters")
  .matches(
    /^[A-Z][A-Za-z0-9]{5,19}$/,
    "Password must start with an uppercase letter and contain only letters and numbers"
  );

export const RegisterSchema = yup.object({
  name: yup.string().required("Please add a name"),
  email: yup
    .string()
    .required("Please add an email")
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/i,
      "Please enter a valid Gmail address"
    )
    .transform((value) => value.toLowerCase()),
  password: passwordSchema,
  confirm_password: passwordSchema,
});

export const LoginSchema = yup.object({
  email: yup
    .string()
    .required("Please add an email")
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/i,
      "Please enter a valid Gmail address"
    )
    .transform((value) => value.toLowerCase()),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be no more than 20 characters")
    .matches(
      /^[A-Z][A-Za-z0-9]{5,19}$/,
      "Password must start with an uppercase letter and contain only letters and numbers"
    ),
});

export const EXPENSE_CATEGORIES = [
  "Food",
  "Travel",
  "Utilities",
  "Rent",
  "Groceries",
  "Entertainment",
  "Transport",
  "Other",
];

export const ExpenseSchema = yup.object({
  title: yup.string().trim().required("Please enter a title."),
  category: yup
    .string()
    .oneOf(EXPENSE_CATEGORIES, "Select a valid category.")
    .required(),
  amount: yup
    .number()
    .typeError("Amount must be a number.")
    .positive("Please enter a valid positive amount.")
    .required("Amount is required."),
  date: yup.date().typeError("Invalid date.").required("Date is required."),
});
