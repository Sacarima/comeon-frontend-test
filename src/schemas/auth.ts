import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().trim().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;


export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address in the correct format, e.g. you@domainname.pl')
    .email('Enter your email address in the correct format, e.g. you@domainname.pl'),

  phonePrefix: z
    .string()
    .trim()
    .min(1, 'Enter the area code (e.g. +48) and in the next field enter your phone number without spaces or special characters. Only numbers are allowed, e.g. 123456789.')
    .regex(
      /^\+\d{1,4}$/,
      'Enter the area code (e.g. +48) and in the next field enter your phone number without spaces or special characters. Only numbers are allowed, e.g. 123456789.',
    ),  
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Enter the area code (e.g. +48) and in the next field enter your phone number without spaces or special characters. Only numbers are allowed, e.g. 123456789.')
    .regex(
      /^\d+$/,
      'Enter the area code (e.g. +48) and in the next field enter your phone number without spaces or special characters. Only numbers are allowed, e.g. 123456789.',
    ),

  password: z
  .string()
  .min(8, '8-15 characters')
  .max(15, '8-15 characters')
  .regex(/[A-Za-z]/, 'Other than email')
  .regex(/\d/, 'One digit')
  .regex(/[^A-Za-z0-9]/, 'One special character'),

  termsAccepted: z.literal(true, {
    message: 'You must accept the privacy policy to register',
  }),

  marketingAccepted: z.boolean().optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;