import { Model } from '@nozbe/watermelondb';
import { text, field, date, readonly, children } from '@nozbe/watermelondb/decorators';
import Idoso from './Idoso';

export default class User extends Model {
  static table = 'users';

  @text('external_id') externalId!: string;
  @text('name') name!: string;
  @text('email') email!: string;
  @field('photo') photo!: string;
  @field('admin') admin?: boolean;
  @text('password') password!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('idoso') idosos!: Idoso[];
}
