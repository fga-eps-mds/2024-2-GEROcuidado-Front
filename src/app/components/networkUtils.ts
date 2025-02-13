import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';
import * as Network from 'expo-network';
import { Q } from "@nozbe/watermelondb";
import Idoso from "../../model/Idoso";

// src/utils/networkUtils.ts
export const checkNetworkConnection = async () => {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected;
  };