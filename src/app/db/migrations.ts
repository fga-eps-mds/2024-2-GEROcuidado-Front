import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';
import { tableSchema } from '@nozbe/watermelondb';

// Define a migração para a versão 2 do banco de dados
export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        // Passo para adicionar as colunas à tabela 'users' se elas ainda não existirem
        {
          type: 'add_columns',
          table: 'users',
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
              { name: 'descricao', type: 'string', isOptional: true },
              { name: 'user_id', type: 'string', isIndexed: true },
            ],
          }),
        },
      ],
    },
  ],
});
