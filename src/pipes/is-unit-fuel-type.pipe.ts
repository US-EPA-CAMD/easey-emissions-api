import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { getManager, Raw } from 'typeorm';

import { FuelTypeCode } from '../entities/fuel-type-code.entity';

export function IsUnitFuelType(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUnitFuelType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const manager = getManager();

          const found = await manager.findOne(FuelTypeCode, {
            fuelTypeDescription:  Raw(alias => `UPPER(${alias}) LIKE '${value.toUpperCase()}'`),
          });
          return found != null;
        },
      },
    });
  };
}
