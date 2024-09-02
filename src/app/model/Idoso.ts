import { Model } from '@nozbe/watermelondb';
import { text, field, readonly, relation, date } from '@nozbe/watermelondb/decorators';
import Usuario from './Usuario';

export default class Idoso extends Model {
  static table = 'idoso';

  @text('nome') nome!: string;
  @text('dataNascimento') dataNascimento!: string;
  @field('tipoSanguineo') tipoSanguineo!: string;
  @text('telefoneResponsavel') telefoneResponsavel!: string;
  @text('descricao') descricao!: string;

  @field('user_id') userId!: string;

  @relation('usuario', 'user_id') user!: Usuario;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
