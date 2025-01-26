import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';
import { tableSchema } from '@nozbe/watermelondb';

// Define a migração para a versão 2 do banco de dados
export default schemaMigrations({
  migrations: [
    {
      toVersion: 8,
      steps: [
        // Passo para adicionar as colunas à tabela 'usuario' se elas ainda não existirem
        {
          type: 'add_columns',
          table: 'usuario',
          columns: [
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
          ],
        },
        // Passo para criar a tabela 'idoso' se ela ainda não existir
        {
          type: 'create_table',
          schema: tableSchema({
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
              { name: 'updated_at', type: 'number' }
            ],
          }),
        },
        {
          type: 'create_table',
          schema: tableSchema({
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
              { name: 'updated_at', type: 'number' }
            ],
          }),
        },
        {
          type: 'create_table',
          schema: tableSchema({
            name: 'metrica',
            columns: [
              { name: 'idoso_id', type: 'string', isIndexed: true },
              { name: 'categoria', type: 'string' },
              { name: 'valorMaximo', type: 'string', isOptional: true },
            ],
          }),
        },
        {
          type: 'create_table',
          schema: tableSchema({
            name: 'evento',
            columns: [
              { name: 'titulo', type: 'string' },
              { name: 'descricao', type: 'string' },
              { name: 'categoria', type: 'string' },
              { name: 'dataHora', type: 'number' },
              { name: 'notificacao', type: 'boolean' },
              { name: 'token', type: 'string' },
              { name: 'idoso_id', type: 'string', isIndexed: true },
              { name: 'created_at', type: 'number' },
              { name: 'updated_at', type: 'number' },
            ],
          }),
        },
      ],
    },
  ],
});
