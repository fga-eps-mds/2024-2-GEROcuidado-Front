import { Model } from "@nozbe/watermelondb";
import { field, text, date, readonly, relation, json } from "@nozbe/watermelondb/decorators";
import Idoso from "./Idoso";

const sanitizeStringArray = (rawDias: any): string[] => {
  return Array.isArray(rawDias) ? rawDias.map(String) : [];
};

export default class Rotina extends Model {
  static table = 'rotina';

  @text('titulo') titulo!: string;
  @text('categoria') categoria!: string;
  @json('dias', sanitizeStringArray) dias!: string[];
  @date('dataHora') dataHora!: Date;
  @text('descricao') descricao!: string;
  @field('token') token!: string;
  @field('notificacao') notificacao!: boolean;
  @json('dataHoraConcluidos', sanitizeStringArray) dataHoraConcluidos!: string[];
  @field('idoso_id') idIdoso!: string;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('idoso', 'idoso_id') idoso!: Idoso;
}