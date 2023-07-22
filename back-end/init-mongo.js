/**
 * @description script auto create new database from env and auto grant user to have permission perform on that database as well
 */
db = db.getSiblingDB(process.env.DATABASE_NAME);
db.createUser({
  user: process.env.DATABASE_USER,
  pwd: process.env.DATABASE_PASS,
  roles: [
    { role: "readWrite", db: process.env.DATABASE_NAME },
    { role: "dbAdmin", db: process.env.DATABASE_NAME },
  ],
});
