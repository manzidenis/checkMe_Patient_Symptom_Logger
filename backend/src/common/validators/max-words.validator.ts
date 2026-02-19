import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

function countWords(value: string): number {
  const normalized = value.trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).length;
}

export function MaxWords(maxWords: number, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'maxWords',
      target: object.constructor,
      propertyName,
      constraints: [maxWords],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [max] = args.constraints as [number];
          if (value === undefined || value === null || value === '') return true;
          if (typeof value !== 'string') return false;
          return countWords(value) <= max;
        },
        defaultMessage(args: ValidationArguments) {
          const [max] = args.constraints as [number];
          return `${args.property} must contain at most ${max} words`;
        },
      },
    });
  };
}
