import { Model } from "@nozbe/watermelondb";
import { field, text, readonly, date, children } from "@nozbe/watermelondb/decorators";
import ValorMetrica from "./ValorMetrica";

export default class Metrica extends Model {
  static table = 'metrica';

  @field('idoso_id') idIdoso!: string;
  @text('categoria') categoria!: string;
  @text('valorMaximo') valorMaximo!: string;
  @readonly @date('created_at') created_at!: Date;
  @readonly @date('updated_at') updated_at!: Date;

  @children('valor_metrica') valorMetricas!: ValorMetrica;
}