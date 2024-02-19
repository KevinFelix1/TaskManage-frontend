import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string({ required_error: "El nombre de usuario es obligatorio" })
      .min(3, { message: "Nombre de usuario demasiado corto" }),
    email: z
      .string({ required_error: "El correo electrónico es requerido" })
      .email({ message: "Email no valido" }),
    password: z
      .string({ required_error: "El password es requerido" })
      .min(8, { message: "El password es demasiado corto" }),
    repeatPassword: z
      .string({ required_error: "El password es requerido" })
      .min(8, { message: "El password es demasiado corto" }),
  })
  .refine((values) => values.password === values.repeatPassword, {
    message: "Tus passwords no coinciden",
  });
