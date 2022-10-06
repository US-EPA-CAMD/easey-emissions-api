import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function OneOrMore(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'oneOrMore',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = args.object[relatedPropertyName];
          if (value || relatedValue) {
            return true;
          }
          return false;
        },
      },
    });
  };
}
