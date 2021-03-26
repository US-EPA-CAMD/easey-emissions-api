import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { getManager } from 'typeorm';

import { ProgramCode } from '../entities/program-code.entity';

/**
 * This decorator can optionally exclude programs specified in the @property param
 */
export function IsProgram(
  property?: string[],
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isProgram',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          if (args.constraints[0].includes(value.toUpperCase())) {
            return false;
          }

          const manager = getManager();
          const found = await manager.findOne(ProgramCode, {
            programCode: value.toUpperCase(),
          });
          return found != null;
        },
      },
    });
  };
}
