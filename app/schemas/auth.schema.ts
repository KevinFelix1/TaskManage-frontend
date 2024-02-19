import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string({ required_error: "El nombre de usuario es obligatorio" })
      .min(3, {
        message: "El nombre de usuario debe ser mayor a 3 caracteres",
      }),
    email: z
      .string({ required_error: "El correo electrónico es requerido" })
      .email({ message: "Email no valido" }),
    password: z
      .string({ required_error: "El password es requerido" })
      .min(8, { message: "El password es demasiado corto" }),
    repeatPassword: z
      .string({ required_error: "El password es requerido" })
      .min(8, { message: "Repite tu contraseña" }),
  })
  .refine((values) => values.password === values.repeatPassword, {
    message: "Tus passwords no coinciden",
  });

export const authenticateSchema = z.object({
  email: z
    .string({ required_error: "El correo electrónico es requerido" })
    .email({ message: "Email no valido" }),
  password: z
    .string({ required_error: "El password es requerido" })
    .min(8, { message: "El password es demasiado corto" }),
});
