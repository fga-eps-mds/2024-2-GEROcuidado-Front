import { Model } from "@nozbe/watermelondb";
import { field, text, date, readonly, json, relation } from "@nozbe/watermelondb/decorators";
import Idoso from "./Idoso";

const sanitizeStringArray = (rawParticipantes: any): string[] => {
  return Array.isArray(rawParticipantes) ? rawParticipantes.map(String) : [];
};

export default class Evento extends Model {
  static table = 'evento';

  @text('titulo') titulo!: string;
  @text('descricao') descricao!: string;
  @date('dataHora') dataHora!: Date;
  @text('categoria') categoria!: string;
  @text('local') local!: string;
  @json('participantes', sanitizeStringArray) participantes!: string[];

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('idoso', 'idoso_id') idoso!: Idoso;
    token: string | undefined;
    notificacao!: boolean;
    idIdoso: string | undefined;
}
