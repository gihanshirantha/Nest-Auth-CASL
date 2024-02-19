import { Action, Subjects } from './ability.factory';
import { SetMetadata } from '@nestjs/common';

export interface RequiredRules {
  action: Action;
  subject: Subjects;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements) =>
  SetMetadata(CHECK_ABILITY, requirements);

export class ReadUserAbility implements RequiredRules {
  action: Action;
  subject: Subjects;
}
