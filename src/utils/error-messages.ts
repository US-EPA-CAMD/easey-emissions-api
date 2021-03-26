import { ApiConfigService } from './api-config.service';

export const ErrorMessages = {
  FV1: `One or more unit types are not valid. Refer to the list of available unit types for valid values ${ApiConfigService.getMdm()}unit-types`,
  FV2: `One or more unit fuel types are not valid. Refer to the list of available unit fuel types for valid values ${ApiConfigService.getMdm()}fuel-types`,
  FV3: `One or more control technologies are not valid. Refer to the list of available control technologies for valid values ${ApiConfigService.getMdm()}control-technologies`,
  FV4: `One or more states are not valid. Use the two letter postal abbreviation (use TX, not Texas).`,
  FV5: `Enter the $property in the YYYY-MM-DD format`,
  FV6: `Enter an $property that is greater than or equal to the $constraint`,
  FV7: `Enter a $property year between 1995 and this year`,
  FV9: `One or more ORIS codes are not valid. Refer to the list of available ORIS codes for valid values ${ApiConfigService.getFacApi()}facilities`,
  FV10: `$property should not be null or undefined`,
  FV11: `Enter a valid $property in the YYYY-MM-DD format`,
  FV12: `One or more programs is not valid. Refer to the list of available programs for valid values ${ApiConfigService.getMdm()}programs`,
  //   FV13: `Enter a valid $property in the YYYY format`,
  //   FV14: `The account number is not valid. Refer to the list of available account numbers for valid values [placeholder for link to endpoint]`;
  //   FV15: `The account type is not valid. Refer to the list of available type numbers for valid values [placeholder for link to endpoint]`;
  //   FV16: `Enter the $property in the MM/DD/YYYY format`;
};
