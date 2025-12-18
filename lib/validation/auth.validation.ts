import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("email is not valid"),
  password: z
    .string()
    .min(6, "password must be at least 6 characters"),
});

export type TLoginSchema = z.infer<typeof loginSchema>;


export const registerSchema = z.object({
  name: z.string().min(2, "name must be at least 2 characters"),
  email: z.email("email is not valid"),
  password: z
    .string()
    .min(6, "password must be at least 6 characters"),
  confirmPassword: z
    .string()
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // error will appear under confirmPassword
    message: "Passwords do not match",
  });;

  export type TRegisterSchema = z.infer<typeof registerSchema>;
