/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type InferSchemaType, Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { type IUser } from "../types/user";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  username: {
    type: String,
    required: [true, "Please choose your username!"],
    unique:true
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (this: IUser, inputValue: string) {
        return inputValue === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  socket_id: {
    type: String,
    required: false
  },
});
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
  // @ts-expect-error
  this.passwordConfirm = undefined;
  next();
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
