import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';
import * as Network from 'expo-network';
import { checkNetworkConnection } from '../components/networkUtils';
import { Q } from "@nozbe/watermelondb";
import Idoso from "../model/Idoso";

// src/sync/syncService.ts
export const syncUnsyncedIdosos = async () => {
  const isConnected = await checkNetworkConnection();
  if (!isConnected) return;

  const idosoCollection = database.get('idoso') as Collection<Idoso>;
  const unsyncedIdosos = await idosoCollection.query(Q.where('sincronizado', false)).fetch();

  for (const idoso of unsyncedIdosos) {
    await syncIdosoWithServer(idoso);
  }
};