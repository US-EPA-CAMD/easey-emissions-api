import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { getManager, ILike } from 'typeorm';

import { ControlCode } from '../entities/control-code.entity';

export function IsControlTechnology(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isControlTechnology',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const manager = getManager();

          const found = await manager.findOne(ControlCode, {
            controlDescription: ILike(value),
          });
          return found != null;
        },
      },
    });
  };
}
