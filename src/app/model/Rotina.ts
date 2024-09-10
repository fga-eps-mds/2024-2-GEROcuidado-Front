import { Model } from "@nozbe/watermelondb";
import { field, text, date, readonly, relation } from "@nozbe/watermelondb/decorators";
import Idoso from "./Idoso";

export default class Rotina extends Model {
  static table = 'rotina';

  @text('titulo') titulo!: string;

  @text('categoria') categoria!: string;

  // Comma separated integer values:
  // "0;1;2;3"
  @text('dias') dias!: string;

  @date('dataHora') dataHora!: number;

  @text('descricao') descricao!: string;

  @field('token') token!: string;

  @field('notificacao') notificacao!: boolean;

  @field('dataHoraConcluidos') dataHoraConcluidos!: string;

  @field('idoso_id') idoso_id!: string;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('idoso', 'idoso_id') idoso!: Idoso;
}