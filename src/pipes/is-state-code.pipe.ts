import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

import { getManager } from "typeorm";

import { StateCode } from "../entities/state-code.entity";

export function IsStateCode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isStateCode",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const manager = getManager();

          const found = await manager.findOne(StateCode, {
            stateCode: value.toUpperCase(),
          });
          return found != null;
        },
      },
    });
  };
}
