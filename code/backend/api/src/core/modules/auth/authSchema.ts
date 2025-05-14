import { z } from "zod";

const authSignIn = z.object({
  body:z.object({
    username: z.string().min(6, "Username must be at least 8 characters"),
    password: z.string().min(6, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
  })
  });

  const refreshToken = z.object({
    body:z.object({
      token: z.string({
        required_error: "Token is required",
        invalid_type_error: "Token must be a string"
      }).min(1, "Token cannot be empty")
    })
  });

  export {
    authSignIn,
    refreshToken
  };