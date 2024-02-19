import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

export enum Action {
  Manage = 'mange',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = InferSubjects<typeof User> | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );
    if (user.isAdmin) {
      can(Action.Manage, 'all');
      cannot(Action.Manage, User, {
        organizationId: { $ne: user.organizationId },
      }).because('you can only manage users in your organization');
    } else {
      can(Action.Read, User);
      cannot(Action.Create, User).because('your special message:only admins!!');
      cannot(Action.Delete, User).because('You just Cannot');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
