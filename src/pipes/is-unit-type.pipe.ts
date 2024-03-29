import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { getManager, ILike } from 'typeorm';

import { UnitTypeCode } from '../entities/unit-type-code.entity';

export function IsUnitType(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsUnitType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const manager = getManager();

          const found = await manager.findOne(UnitTypeCode, {
            unitTypeDescription: ILike(value),
          });
          return found != null;
        },
      },
    });
  };
}
