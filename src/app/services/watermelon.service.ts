import { synchronize } from '@nozbe/watermelondb/sync'
import database from "../db";
// Using built-in SyncLogger
import SyncLogger from '@nozbe/watermelondb/sync/SyncLogger'
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_API = {
  host: process.env.EXPO_PUBLIC_API_URL,
  port: process.env.EXPO_PUBLIC_API_USUARIO_PORT,
  sync_endpoint: '/api/usuario/sync/pull_users'
}

const logger = new SyncLogger(10)

export const syncDatabaseWithServer = async (): Promise<void> => {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      // console.log("########## SYNC ##############")
      // console.log(lastPulledAt);
      // console.log(schemaVersion);
      // console.log(migration);

      const query_params = `?lastPulledAt=${lastPulledAt || 0}&schemaVersion=${schemaVersion}&migration=${migration}`;
      const uri = `${USER_API.host}:${USER_API.port}${USER_API.sync_endpoint}${query_params}`;

      // console.log("uri", uri)
      const token = await AsyncStorage.getItem('token');

      // console.log("token na sinc: ", token);
      const response = await fetch(uri, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.log("Sync was not ok", await response.text());
        throw new Error(await response.text());
      }

      const { data: { changes, timestamp }, message } = await response.json();

      // console.log(changes);
      // console.log(timestamp);
      // console.log(message);

      return { changes, timestamp }
    },
    log: logger.newLog(),
    migrationsEnabledAtVersion: 1,
  });
}
