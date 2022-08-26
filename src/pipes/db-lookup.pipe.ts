import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

import { getManager, FindOneOptions } from 'typeorm';

// TODO: MOVE TO COMMONE PIPES
export function DbLookup(
  type: any,
  findOption: (validationArguments: ValidationArguments) => FindOneOptions,
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'dbLookup',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          if (value) {
            const manager = getManager();
            const found = await manager.findOne(type, findOption(args));
            return found != null;
          }
          return true;
        },
      },
    });
  };
}
