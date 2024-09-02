import { appSchema, tableSchema } from '@nozbe/watermelondb';


export default appSchema({
 version: 5,
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
 ],
});
