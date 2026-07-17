import {Client} from "pg";
import dotenv from "dotenv";

dotenv.config();

export async function initDB(){

    const client=new Client({
        host:process.env.DB_HOST!,
        port:parseInt(process.env.DB_PORT!),
        user :process.env.DB_USER!,
        password:process.env.DB_PASSWORD!,
        database:"postgres",
    });

    await client.connect();

    const dbName = process.env.DB_NAME;

  const result = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [dbName]
  );

  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`✅ Database ${dbName} created`);
  } else {
    console.log(`✅ Database ${dbName} already exists`);
  }

    await client.end();

}