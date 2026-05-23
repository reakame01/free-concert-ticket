import { z } from 'zod';
import type { Messages } from '@/lib/i18n/types';

export const createConcertSchema = (v: Messages['validation']['concert']) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, v.nameRequired)
      .max(255, v.nameMax),
    description: z.string().trim().min(1, v.descriptionRequired),
    totalSeats: z
      .number({ message: v.seatsInvalid })
      .refine((value) => !Number.isNaN(value), {
        message: v.seatsInvalid,
      })
      .int(v.seatsInt)
      .min(1, v.seatsMin),
  });

export type CreateConcertFormValues = z.infer<
  ReturnType<typeof createConcertSchema>
>;
