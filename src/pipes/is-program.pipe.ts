import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { getManager } from 'typeorm';

import { ProgramCode } from '../entities/program-code.entity';

export function IsProgram(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isProgram',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const manager = getManager();

          const found = await manager.findOne(ProgramCode, {
            programCode: value,
          });
          return found != undefined;
        },
      },
    });
  };
}
