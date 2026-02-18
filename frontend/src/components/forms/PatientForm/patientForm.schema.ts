import { z } from 'zod'

export const patientFormSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name must be under 50 characters'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be under 50 characters'),
    middleName: z.string().max(50, 'Middle name must be under 50 characters').optional().or(z.literal('')),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    sex: z.enum(['MALE', 'FEMALE', 'OTHER'], { errorMap: () => ({ message: 'Please select gender' }) }),
    phone: z.string().min(1, 'Phone number is required').max(20, 'Phone number must be under 20 characters'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    country: z.string().min(1, 'Country is required').max(100, 'Country must be under 100 characters'),
    city: z.string().min(1, 'City is required').max(100, 'City must be under 100 characters'),
})

export type PatientFormValues = z.infer<typeof patientFormSchema>