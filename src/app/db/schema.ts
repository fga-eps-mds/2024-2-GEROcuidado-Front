import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 1,
  tables: [
    // We'll add tableSchemas here later
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
    })
  ]
})