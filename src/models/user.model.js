import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    minlength: 5,
    maxlength: 15,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: Map,
    default: { user: true, admin: false },
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  } catch (err) {
    console.error(err);
  }
});

userSchema.pre("findOneAndUpdate", async function () {
  try {
    this._update.password = await bcrypt.hash(this._update.password, 10);
  } catch (err) {
    console.error(err);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
export const User = mongoose.model("user", userSchema);
