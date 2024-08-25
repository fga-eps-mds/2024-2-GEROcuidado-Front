// model/Post.js
import { Model } from '@nozbe/watermelondb';
import { text, field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class User extends Model {
  static table = 'users';

  // ID coming from the API
  @text('external_id') externalId!: string;
  @text('name') name!: string;
  @text('email') email!: string;
  @field('photo') photo!: string;
  @field('admin') admin?: boolean;
  @text('password') password!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}