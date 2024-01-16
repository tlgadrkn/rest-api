import z, { TypeOf } from 'zod';
export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string({
        required_error: 'Name is required',
      }),
      password: z
        .string({
          required_error: 'Password is required',
        })
        .min(6, 'Password must be at least 6 characters'),
      passwordConfirmation: z.string({
        required_error: 'Password confirmation is required',
      }),
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email('Not a valid email'),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Passwords do not match',
      path: ['passwordConfirmation'],
    }),
});

// export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  'body.passwordConfirmation'
>;
