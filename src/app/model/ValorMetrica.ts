import { Model } from "@nozbe/watermelondb";
import { field, text, readonly, date, relation } from "@nozbe/watermelondb/decorators";
import Metrica from "./Metrica";

export default class ValorMetrica extends Model {
  static table = 'valor_metrica';

  @field('metrica_id') metrica_id!: string;
  @text('valor') valor!: string;
  @text('dataHora') dataHora!: string;
  @readonly @date('created_at') created_at!: Date;
  @readonly @date('updated_at') updated_at!: Date;

  @relation('metrica', 'metrica_id') metrica!: Metrica;
}