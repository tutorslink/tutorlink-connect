import { Databases, Client } from "appwrite";
const client = new Client();
const databases = new Databases(client);
console.log(databases.createDocument.toString());
