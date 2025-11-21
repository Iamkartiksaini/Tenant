const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
          return emailRegex.test(value);
        },
        message: "Please enter a valid Gmail address",
      },
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
  },
  { timestamps: true,   },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});


const User = mongoose.model("users", userSchema);
module.exports = User;
