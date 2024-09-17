import { appSchema, tableSchema } from '@nozbe/watermelondb';
// import schema from '../db/schema'; // Ajuste o caminho conforme necessário
import schema from '../db/schema';

describe('Database Schema', () => {
    it('deve ter a versão correta', () => {
        expect(schema.version).toBe(7);
    });

    it('deve ter as tabelas corretas', () => {
        console.log('Schema:', schema); // Imprime a estrutura real do schema
    
        // Verifica se o schema tem a propriedade 'tables'
        expect(schema).toHaveProperty('tables');
    
        // Verifica a estrutura de 'tables'
        const tables = schema.tables;
        console.log('Tables:', tables); // Imprime o conteúdo de tables
    
        // Verifica se 'tables' é um objeto
        expect(typeof tables).toBe('object');
        expect(tables).not.toBeNull();
    
        // Obtém os nomes das tabelas
        const tableNames = Object.keys(tables);
        const expectedTables = [
        'usuario',
        'idoso',
        'rotina',
        'metrica',
        'valor_metrica'
        ];
    
        expectedTables.forEach((tableName) => {
        expect(tableNames).toContain(tableName);
        });
    });
  

    it('deve ter as colunas corretas para cada tabela', () => {
        console.log('Schema:', schema); // Imprime a estrutura real do schema
    
        // Definição das colunas esperadas para cada tabela
        const expectedColumns = {
        usuario: [
            'nome', 'foto', 'email', 'senha', 'admin', 'created_at', 'updated_at'
        ],
        idoso: [
            'nome', 'dataNascimento', 'tipoSanguineo', 'telefoneResponsavel', 'descricao', 'foto', 'user_id', 'created_at', 'updated_at'
        ],
        rotina: [
            'titulo', 'categoria', 'dias', 'dataHora', 'descricao', 'token', 'notificacao', 'dataHoraConcluidos', 'idoso_id', 'created_at', 'updated_at'
        ],
        metrica: [
            'idoso_id', 'categoria', 'valorMaximo', 'created_at', 'updated_at'
        ],
        valor_metrica: [
            'metrica_id', 'valor', 'dataHora', 'created_at', 'updated_at'
        ]
        };
    
        // Verifica a estrutura do schema
        const tablesObj = schema.tables;
        console.log('Tables:', tablesObj); // Imprime o conteúdo de tables
    
        // Verifica se 'tables' é um objeto
        expect(typeof tablesObj).toBe('object');
        expect(tablesObj).not.toBeNull();
    
        // Verifica se cada tabela tem as colunas esperadas
        Object.entries(expectedColumns).forEach(([tableName, columns]) => {
        const tableSchema = tablesObj[tableName];
        if (!tableSchema) {
            throw new Error(`Table ${tableName} not found in schema`);
        }
    
        // Converte columns para um array se necessário
        const columnArray = Array.isArray(tableSchema.columns) 
            ? tableSchema.columns 
            : Object.values(tableSchema.columns);
        
        // Garante que columns é um array
        expect(Array.isArray(columnArray)).toBe(true);
    
        // Obtém os nomes das colunas
        const columnNames = columnArray.map((col: { name: string }) => col.name);
        
        // Verifica se cada coluna esperada está presente
        columns.forEach((column) => {
            expect(columnNames).toContain(column);
        });
        });
    });
    
  

    it('deve ter as colunas corretas com o tipo correto', () => {
        console.log('Schema:', schema); // Imprime a estrutura real do schema
      
        const tables = {
          usuario: [
            { name: 'nome', type: 'string' },
            { name: 'foto', type: 'string' },
            { name: 'email', type: 'string' },
            { name: 'senha', type: 'string' },
            { name: 'admin', type: 'boolean' },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' }
          ],
          idoso: [
            { name: 'nome', type: 'string' },
            { name: 'dataNascimento', type: 'string' },
            { name: 'tipoSanguineo', type: 'string' },
            { name: 'telefoneResponsavel', type: 'string' },
            { name: 'descricao', type: 'string' },
            { name: 'foto', type: 'string' },
            { name: 'user_id', type: 'string' },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' }
          ],
          rotina: [
            { name: 'titulo', type: 'string' },
            { name: 'categoria', type: 'string' },
            { name: 'dias', type: 'string' },
            { name: 'dataHora', type: 'number' },
            { name: 'descricao', type: 'string' },
            { name: 'token', type: 'string' },
            { name: 'notificacao', type: 'boolean' },
            { name: 'dataHoraConcluidos', type: 'string' },
            { name: 'idoso_id', type: 'string' },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' }
          ],
          metrica: [
            { name: 'idoso_id', type: 'string' },
            { name: 'categoria', type: 'string' },
            { name: 'valorMaximo', type: 'string' },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' }
          ],
          valor_metrica: [
            { name: 'metrica_id', type: 'string' },
            { name: 'valor', type: 'string' },
            { name: 'dataHora', type: 'number' },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' }
          ]
        };
      
        // Verifica a estrutura de schema
        const tablesObj = schema.tables;
        console.log('Tables:', tablesObj); // Imprime o conteúdo de tables
      
        // Verifica se 'tables' é um objeto
        expect(typeof tablesObj).toBe('object');
        expect(tablesObj).not.toBeNull();
      
        // Verifica se cada coluna tem o tipo correto
        Object.entries(tables).forEach(([tableName, columns]) => {
          const tableSchema = tablesObj[tableName];
          if (!tableSchema) {
            throw new Error(`Table ${tableName} not found in schema`);
          }
      
          const columnsObj = tableSchema.columns;
      
          columns.forEach(({ name, type }) => {
            const column = columnsObj[name];
            expect(column).toBeTruthy();
            if (column) {
              expect(column.type).toBe(type);
            }
          });
        });
    });
});
