import { schemaMigrations, addColumns } from '@nozbe/watermelondb/Schema/migrations';

const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 10, // ⬅️ Certifique-se de que esta versão está alinhada com seu `schema.ts`
      steps: [
        addColumns({
          table: 'idoso',
          columns: [
            { name: 'isSynced', type: 'boolean', isOptional: true }, // ⬅️ Adiciona corretamente a coluna
          ],
        }),
      ],
    },
  ],
});

export default migrations;
