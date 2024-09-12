// model/Post.js
import { Model } from '@nozbe/watermelondb';
import { text, field, date, readonly, children } from '@nozbe/watermelondb/decorators';
import Idoso from './Idoso';

export default class Usuario extends Model {
  static table = 'usuario';

  @text('nome') nome!: string;
  @field('foto') foto!: string;
  @text('email') email!: string;
  @text('senha') senha!: string;
  @field('admin') admin?: boolean;
  @readonly @date('created_at') created_at!: Date;
  @readonly @date('updated_at') updated_at!: Date;
  @children('idoso') idosos!: Idoso;
}