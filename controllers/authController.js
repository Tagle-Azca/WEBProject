import { errorHandler } from "../middleware/error.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { signUpSchema, signInSchema } from "../validations/authValidation.js";

// Función para crear Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Test controller
export const test = asyncHandler(async (req, res) => {
  res.json({ message: "Auth route is working" });
});

// SignUp controller
export const signUp = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  const { error } = signUpSchema.validate(req.body);
  if (error) return next(errorHandler(400, error.details[0].message));

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(errorHandler(400, "El correo ya está registrado"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = generateToken(newUser._id);

  res.status(201).json({
    message: "Usuario creado exitosamente",
    token,
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
    },
  });
});

// SignIn controller
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = signInSchema.validate(req.body);
  if (error) return next(errorHandler(400, error.details[0].message));

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(errorHandler(404, "Usuario no encontrado"));
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return next(errorHandler(401, "Credenciales incorrectas"));
  }

  const token = generateToken(user._id);
  const { password: pass, ...userData } = user.toObject();

  res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
    .status(200)
    .json(userData);
});

// Google SignIn controller
export const google = asyncHandler(async (req, res, next) => {
  const { email, name, photo } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    const randomPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    user = await User.create({
      username:
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email,
      password: hashedPassword,
      avatar: photo,
    });
  }

  const token = generateToken(user._id);
  const { password: pass, ...userData } = user.toObject();

  res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
    .status(200)
    .json(userData);
});

// SignOut controller
export const signOut = asyncHandler(async (req, res) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Usuario desconectado exitosamente" });
});