import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email("Please Enter a valid email id"),

 username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be under 20 characters")
      .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
        message:
          "Username must start with a letter and contain only letters, numbers, or underscores",
      }),

    password: z.string(),

    confirmPassword: z.string(),

    terms: z.boolean().refine(val => val === true, {
      message: "You must agree to terms",
    }),
  })

  // ⭐ Full password rules (1-by-1 message)
  .superRefine((data, ctx) => {
    const password = data.password;

  

    if (password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must contain at least 6 characters",
      });
      return;
    }

    if (!/[0-9]/.test(password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must contain at least 1 number",
      });
      return;
    }

    if (!/[A-Z]/.test(password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must contain an uppercase letter",
      });
      return;
    }

    if (!/[a-z]/.test(password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must contain a lowercase letter",
      });
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must contain a special character",
      });
      return;
    }

    // ⭐ Confirm Password
    if (data.confirmPassword.length > 0 && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });
