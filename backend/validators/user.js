const { z } = require("zod");

const signupSchema = z.object({
  email: z.email({ message: "Invalid email format" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
  firstName: z
    .string({ required_error: "First name is required" })
    .min(1, { message: "First name cannot be empty" }),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, { message: "Last name cannot be empty" }),
});

const signinSchema = z.object({
  email: z.email({ message: "Invalid email format" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
});

module.exports = {
  signupSchema,
  signinSchema,
};
