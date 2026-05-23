import { z } from 'zod';
import type { Messages } from '@/lib/i18n/types';

export const createLoginSchema = (v: Messages['validation']['login']) =>
  z.object({
    username: z
      .string()
      .trim()
      .min(1, v.usernameRequired)
      .max(100, v.usernameMax),
    password: z.string().min(1, v.passwordRequired),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export const createRegisterSchema = (v: Messages['validation']['register']) =>
  z
    .object({
      username: z
        .string()
        .trim()
        .min(3, v.usernameMin)
        .max(100, v.usernameMax),
      password: z
        .string()
        .min(6, v.passwordMin)
        .max(100, v.passwordMax),
      confirmPassword: z.string().min(1, v.confirmRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: v.passwordMismatch,
      path: ['confirmPassword'],
    });

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
