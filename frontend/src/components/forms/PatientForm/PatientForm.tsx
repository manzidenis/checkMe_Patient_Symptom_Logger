import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { patientFormSchema, type PatientFormValues } from './patientForm.schema'
import Input from '../../ui/Input'
import Select from '../../ui/Select'
import Button from '../../ui/Button'

interface PatientFormProps {
    onSubmit: (data: PatientFormValues) => void
    isLoading?: boolean
    defaultValues?: Partial<PatientFormValues>
    submitLabel?: string
}

const SEX_OPTIONS = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
]

export default function PatientForm({ onSubmit, isLoading, defaultValues, submitLabel = 'Register Patient' }: PatientFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PatientFormValues>({
        resolver: zodResolver(patientFormSchema),
        defaultValues,
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                    label="First Name"
                    placeholder="e.g. Jane"
                    error={errors.firstName?.message}
                    {...register('firstName')}
                />
                <Input
                    label="Middle Name"
                    placeholder="Optional"
                    error={errors.middleName?.message}
                    {...register('middleName')}
                />
                <Input
                    label="Last Name"
                    placeholder="e.g. Doe"
                    error={errors.lastName?.message}
                    {...register('lastName')}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                    label="Date of Birth"
                    type="date"
                    error={errors.dateOfBirth?.message}
                    {...register('dateOfBirth')}
                />

                <Select
                    label="Gender"
                    options={SEX_OPTIONS}
                    placeholder="Select gender"
                    error={errors.sex?.message}
                    {...register('sex')}
                />

                <Input
                    label="Phone Number"
                    id="phone-number"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    pattern="\\+[1-9]\\d{7,14}"
                    placeholder="+250788123456"
                     error={errors.phone?.message}
                    {...register('phone')}
                />
            </div>

            <Input
                label="Email Address"
                id="email-address"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@example.com"
                error={errors.email?.message}
                {...register('email')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="Country"
                    placeholder="e.g. Rwanda"
                    error={errors.country?.message}
                    {...register('country')}
                />
                <Input
                    label="City"
                    placeholder="e.g. Kigali"
                    error={errors.city?.message}
                    {...register('city')}
                />
            </div>

            <div className="pt-2">
                <Button type="submit" isLoading={isLoading} className="w-full">
                    {submitLabel}
                </Button>
            </div>
        </form>
    )
}
