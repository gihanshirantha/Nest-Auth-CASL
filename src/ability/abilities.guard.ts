import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory, AppAbility } from './ability.factory';
import { CHECK_ABILITY, RequiredRules } from './abilities.decorator';
import { currentUser } from '../user/currentUser';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //canActivate return boolian, boolian is true, yes you can proceed with this route.
    // if it is fales it's gonna return a response of 403.
    const rules =
      this.reflector.get<RequiredRules[]>(
        CHECK_ABILITY,
        context.getHandler(),
      ) || [];

    //const { user } = context.switchToHttp().getRequest();
    const user = currentUser;
    const ability = this.abilityFactory.defineAbility(user);

    try {
      rules.forEach((rule) => {
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject);
      });
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
