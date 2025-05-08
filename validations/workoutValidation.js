import Joi from "joi";

export const createWorkoutSchema = Joi.object({
  workoutName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "El nombre del entrenamiento es obligatorio",
    "string.min": "Debe tener al menos 2 caracteres",
    "string.max": "No puede exceder los 50 caracteres",
  }),
  warmUp: Joi.string().allow(""),
  work: Joi.array().items(
    Joi.object({
      type: Joi.string().valid("distance", "time").required(),
      distance: Joi.number().min(0),
      unit: Joi.string().valid("m", "km", "mi"),
      time: Joi.string().pattern(/^([0-5][0-9]):[0-5][0-9]$/).allow(""),
      pace: Joi.object({
        type: Joi.string().valid("easy", "marathon", "tempo", "threshold", "interval", "repetition"),
        pace: Joi.string().pattern(/^([0-5][0-9]):[0-5][0-9]$/),
      }).allow(null),
      repetitions: Joi.number().integer().min(1).default(1),
      splits: Joi.array().items(
        Joi.object({
          distance: Joi.number(),
          unit: Joi.string().valid("m", "km", "mi"),
          time: Joi.string().allow(""),
          pace: Joi.string().allow(""),
        })
      )
    })
  ).required().messages({
    "array.base": "Debes incluir al menos una parte del trabajo ('work')",
  }),
  coolDown: Joi.string().allow(""),
  user: Joi.string().required().messages({
    "string.empty": "El usuario es obligatorio",
  }),
});

export const addToTrainingPlanSchema = Joi.object({
    date: Joi.date().required().messages({
      "date.base": "La fecha debe ser válida",
      "any.required": "La fecha es obligatoria",
    }),
    week: Joi.number().required().messages({
      "number.base": "La semana debe ser un número",
      "any.required": "La semana es obligatoria",
    }),
    user: Joi.string().required().messages({
      "string.empty": "El ID de usuario es obligatorio",
    }),
    workouts: Joi.array().items(
      Joi.object({
        day: Joi.string().valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday").required(),
        workout: Joi.string().required(),
        comment: Joi.array().items(Joi.string().max(250)),
      })
    ).min(1).required().messages({
      "array.base": "Workouts debe ser un arreglo",
      "array.min": "Debes incluir al menos un entrenamiento",
    }),
  });