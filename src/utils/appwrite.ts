// src/utils/appwrite.ts
import { Client, Account, Databases, Storage } from 'node-appwrite';

// This utility configuration handles both browser and backend server environments safely
export const createAppwriteClient = (sessionCookie?: string) => {
  const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://appwrite.io')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');

  // If a secure session cookie exists from the server context, forward it
  if (sessionCookie) {
    client.setSession(sessionCookie);
  }

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
};
