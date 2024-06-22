import { z } from 'zod';

const signup = z.object({
  body: z.object({
    name: z.string().nonempty({ message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    role: z.enum(['admin', 'user']),
  }),
});

const login = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
  }),
});

export const AuthValidation = {
  signup,
  login,
};
