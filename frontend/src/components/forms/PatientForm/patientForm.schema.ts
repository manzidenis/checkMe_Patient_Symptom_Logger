import { z } from 'zod'

const E164_PHONE_REGEX = /^\+[1-9]\d{7,14}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const patientFormSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name must be under 50 characters'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be under 50 characters'),
    middleName: z.string().max(50, 'Middle name must be under 50 characters').optional().or(z.literal('')),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    sex: z.enum(['MALE', 'FEMALE', 'OTHER'], { errorMap: () => ({ message: 'Please select gender' }) }),
    phone: z
        .string()
        .trim()
        .min(1, 'Phone number is required')
        .regex(E164_PHONE_REGEX, 'Use international format, e.g. +250788123456'),
    email: z
        .string()
        .trim()
        .min(1, 'Email address is required')
        .max(254, 'Email must be under 254 characters')
        .refine((value) => EMAIL_REGEX.test(value), 'Enter a valid email address'),
    country: z.string().min(1, 'Country is required').max(100, 'Country must be under 100 characters'),
    city: z.string().min(1, 'City is required').max(100, 'City must be under 100 characters'),
})

export type PatientFormValues = z.infer<typeof patientFormSchema>
