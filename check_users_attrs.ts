import { Client, Databases } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT!)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

async function check() {
  const attrs = await databases.listAttributes(process.env.VITE_APPWRITE_DATABASE_ID!, "users");
  console.log(attrs.attributes.map(a => a.key));
}
check().catch(console.error);
