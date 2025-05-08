import asyncHandler from "express-async-handler";
import Workout from "../models/workoutModel.js";
import TrainingPlan from "../models/planModel.js";
import { errorHandler } from "../middleware/error.js";
import User from "../models/userModel.js";
import { createWorkoutSchema } from "../validations/workoutValidation.js";
import { addToTrainingPlanSchema } from "../validations/workoutValidation.js";

export const createWorkout = asyncHandler(async (req, res, next) => {
  const { error } = createWorkoutSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const { workoutName, warmUp, work, coolDown, user } = req.body;

  const userExists = await User.findById(user);
  if (!userExists) {
    return next(errorHandler(404, "User not found"));
  }

  try {
    const workout = await Workout.create({
      workoutName,
      warmUp,
      work,
      coolDown,
      user,
    });

    res.status(201).json({
      message: "Workout created successfully",
      workout,
    });
  } catch (error) {
    next(error);
  }
});