import { Platform } from 'react-native'
import { Database, tableSchema } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from './schema'
import migrations from './migrations'
import Usuario from '../model/Usuario'
import Idoso from '../model/Idoso'
import Rotina from '../model/Rotina'
import Metrica from '../model/Metrica'
import ValorMetrica from '../model/ValorMetrica'
// import Post from './model/Post' // ⬅️ You'll import your Models here

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment it out for development purposes -- see Migrations documentation)
  // (optional database name or file system path)
  // dbName: 'myapp',
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: true, /* Platform.OS === 'ios' */
  // (optional, but you should implement this method)
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
  }
})

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: [
    // Post, // ⬅️ You'll add Models to Watermelon here
    Usuario, Idoso, Rotina, Metrica, ValorMetrica
  ],
});

export default database;
