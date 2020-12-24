import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { getManager } from 'typeorm';

import { StateCode } from '../entities/state-code.entity';

@ValidatorConstraint({ name: 'stateValidation' })
export class StateValidation implements ValidatorConstraintInterface {
  async validate(state: string, args: ValidationArguments): Promise<boolean> {
    const manager = getManager();

    const found = await manager.findOne(StateCode, { stateCd: (state.toUpperCase()) });
    if (found != undefined) {
      return true;
    } else {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    // default error message if validation failed
    return 'The state or territory is not valid. Please enter a valid state or territory using the two letter postal abbreviation (use TX, not Texas).';
  }
}
