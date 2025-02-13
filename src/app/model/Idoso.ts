import { Model } from '@nozbe/watermelondb';
import { text, field, readonly, relation, date, children } from '@nozbe/watermelondb/decorators';
import Usuario from './Usuario';
import Metrica from './Metrica';

export default class Idoso extends Model {
  static table = 'idoso';

  @text('nome') nome!: string;
  @text('dataNascimento') dataNascimento!: string;
  @field('tipoSanguineo') tipoSanguineo!: string;
  @text('telefoneResponsavel') telefoneResponsavel!: string;
  @text('descricao') descricao!: string;
  @field('foto') foto!: string;
  @field('user_id') userId!: number;
  @field('sincronizado') sincronizado!: boolean;

  @relation('usuario', 'user_id') user!: Usuario;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('metrica') metricas!: Metrica;
}
