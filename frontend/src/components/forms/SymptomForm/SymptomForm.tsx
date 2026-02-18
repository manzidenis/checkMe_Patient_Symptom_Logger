import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { symptomFormSchema, type SymptomFormValues } from './symptomForm.schema'
import { SYMPTOM_TYPE_OPTIONS } from '../../../constants/symptomTypes'
import Select from '../../ui/Select'
import Input from '../../ui/Input'
import Textarea from '../../ui/Textarea'
import Button from '../../ui/Button'
import AlertBanner from '../../ui/AlertBanner'
import SeveritySlider from './SeveritySlider'

interface SymptomFormProps {
    onSubmit: (data: SymptomFormValues) => void
    isLoading?: boolean
    error?: string | null
    defaultValues?: Partial<SymptomFormValues>
    submitLabel?: string
}

export default function SymptomForm({ onSubmit, isLoading, error, defaultValues, submitLabel = 'Log Symptom' }: SymptomFormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<SymptomFormValues>({
        resolver: zodResolver(symptomFormSchema),
        defaultValues: {
            severity: 3,
            occurredAt: new Date().toISOString().split('T')[0],
            ...defaultValues,
        },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {error && <AlertBanner type="error" message={error} />}

            <Select
                label="Symptom Type"
                options={SYMPTOM_TYPE_OPTIONS}
                placeholder="Select a symptom"
                error={errors.symptomType?.message}
                {...register('symptomType')}
            />

            <Controller
                name="severity"
                control={control}
                render={({ field }) => (
                    <SeveritySlider
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.severity?.message}
                    />
                )}
            />

            <Input
                label="Date of Occurrence"
                type="date"
                error={errors.occurredAt?.message}
                {...register('occurredAt')}
            />

            <Textarea
                label="Notes (optional)"
                placeholder="Additional observations or details..."
                error={errors.notes?.message}
                {...register('notes')}
            />

            <div className="pt-2">
                <Button type="submit" isLoading={isLoading} className="w-full">
                    {submitLabel}
                </Button>
            </div>
        </form>
    )
}