import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export const i_format = ['format1', 'format2', 'format3', 'format4', 'format5', 'format6', 'format7', 'format8', 'format9', 'format10', 'format11', 'format12', 'format13'];

export function IsFormatsArray(validationOptions, list_str) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFormatsArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const parts = value.split(',').map(s => s.trim());
          return parts.every(p => list_str.includes(p));
        },
        defaultMessage(args: ValidationArguments) {
          return `只能使用以下格式: ${list_str.join(', ')}`;
        },
      },
    });
  };
}
