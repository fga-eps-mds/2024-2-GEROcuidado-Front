import { appSchema, tableSchema } from '@nozbe/watermelondb';


export default appSchema({
 version: 6,
 tables: [
   tableSchema({
    name: 'usuario',
    columns: [
      { name: 'nome', type: 'string' },
      { name: 'foto', type: 'string' },
      { name: 'email', type: 'string' },
      { name: 'senha', type: 'string' },
      { name: 'admin', type: 'boolean'},
      { name: 'created_at', type: 'number' },
      { name: 'updated_at', type: 'number' }
    ]
  }),
  tableSchema({
    name: 'idoso',
    columns: [
      { name: 'nome', type: 'string' },
      { name: 'dataNascimento', type: 'string' },
      { name: 'tipoSanguineo', type: 'string' },
      { name: 'telefoneResponsavel', type: 'string' },
      { name: 'descricao', type: 'string' },
      { name: 'foto', type: 'string' },
      { name: 'user_id', type: 'string', isIndexed: true },
      { name: 'created_at', type: 'number' },
      { name: 'updated_at', type: 'number' },
    ],
  }),
  tableSchema({
    name: 'rotina',
    columns: [
      { name: 'titulo', type: 'string' },
      { name: 'categoria', type: 'string' },
      { name: 'dias', type: 'string' },
      { name: 'dataHora', type: 'number' },
      { name: 'descricao', type: 'string' },
      { name: 'token', type: 'string' },
      { name: 'notificacao', type: 'boolean' },
      { name: 'dataHoraConcluidos', type: 'string' },
      { name: 'idoso_id', type: 'string', isIndexed: true },
      { name: 'created_at', type: 'number' },
      { name: 'updated_at', type: 'number' },
    ],
  }),
  tableSchema({
    name: 'metrica',
    columns: [
      { name: 'idoso_id', type: 'string', isIndexed: true },
      { name: 'categoria', type: 'string' },
      { name: 'valorMaximo', type: 'string', isOptional: true },
    ],
  }),
  tableSchema({
    name: 'valor_metrica',
    columns: [
      { name: 'metrica_id', type: 'string', isIndexed: true },
      { name: 'valor', type: 'string' },
      { name: 'dataHora', type: 'number' },
    ],
  }),
 ],
});
