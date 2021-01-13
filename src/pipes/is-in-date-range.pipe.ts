import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsInDateRange(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isInDateRange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if(value) {
            const dateObject = new Date(value);
            const minDate = new Date('1995-01-01');
            const currentYear = new Date().getUTCFullYear();
  
            return (
              dateObject >= minDate && dateObject.getUTCFullYear() <= currentYear
            );
          }
          return true;
        },
      },
    });
  };
}
