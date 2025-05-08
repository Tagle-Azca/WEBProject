import Joi from "joi";

export const signUpSchema = Joi.object({
  username: Joi.string().min(2).max(50).required().messages({
    "string.empty": "El nombre de usuario es obligatorio",
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "string.max": "El nombre no puede exceder 50 caracteres",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "El correo es obligatorio",
    "string.email": "Debe ser un correo válido",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "La contraseña es obligatoria",
    "string.min": "La contraseña debe tener al menos 6 caracteres",
  }),
});

export const signInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "El correo es obligatorio",
    "string.email": "Debe ser un correo válido",
  }),
  password: Joi.string().required().messages({
    "string.empty": "La contraseña es obligatoria",
  }),
});