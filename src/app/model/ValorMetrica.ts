import { Model } from "@nozbe/watermelondb";
import { field, text, readonly, date, relation } from "@nozbe/watermelondb/decorators";
import Metrica from "./Metrica";
import { Associations } from "@nozbe/watermelondb/Model";

export default class ValorMetrica extends Model {
  static table = 'valor_metrica';
  static associations = {
    metrica: { type: 'belongs_to', key: 'metrica_id' }
  };

  @field('metrica_id') idMetrica!: string;
  @text('valor') valor!: string;
  @date('dataHora') dataHora!: Date;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('metrica', 'metrica_id') metrica!: Metrica;
}