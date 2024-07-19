// data layer
const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_talent_agency_db"
);
const createTables = async () => {
  const SQL = `
        DROP TABLE IF EXISTS user_skills;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS skills;

        CREATE TABLE skills(
            id UUID PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL
        );

        CREATE TABLE users(
            id UUID PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
        CREATE TABLE user_skills(
            id UUID PRIMARY KEY,
            user_id UUID references users(id) NOT NULL,
            skill_id UUID references skills(id) NOT NULL,
            CONSTRAINT unique_user_skill UNIQUE (user_id, skill_id)
        );
    `;
  await client.query(SQL);
};
const createUser = async ({ name, password }) => {
  const SQL = `INSERT INTO users(id, name, password) 
                    VALUES($1, $2, $3) RETURNING *`;
  const dbResponse = await client.query(SQL, [
    uuid.v4(),
    name,
    await bcrypt.hash(password, process.env.SALT_ROUNDS || 5),
  ]);
  return dbResponse.rows[0];
};
const createSkill = async ({ name }) => {
  const SQL = `
        INSERT INTO skills(id, name) VALUES($1, $2) 
        RETURNING *;
    `;
  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
};
const createUserSkill = async ({ user_id, skill_id }) => {
  const SQL = `
        INSERT INTO user_skills(id, user_id, skill_id) 
        VALUES($1, $2, $3) RETURNING *;
    `;
  const dbResponse = await client.query(SQL, [uuid.v4(), user_id, skill_id]);
  return dbResponse.rows[0];
};
const destroyUserSkill = async ({ id, user_id }) => {
  const SQL = `
        DELETE FROM user_skills 
        WHERE id=$1 AND user_id=$2
    `;
    console.log(id, user_id);
  await client.query(SQL, [id, user_id]);
};
const fetchSkills = async () => {
  const SQL = `SELECT * FROM skills;`;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};
const fetchUsers = async () => {
  const SQL = `SELECT * FROM users;`;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};
const fetchUserSkills = async (user_id) => {
  const SQL = `
        SELECT * FROM user_skills WHERE user_id=$1;
    `;
  const dbResponse = await client.query(SQL, [user_id]);
  return dbResponse.rows;
};
module.exports = {
  client,
  createTables,
  createUser,
  createSkill,
  createUserSkill,
  fetchUsers,
  fetchSkills,
  fetchUserSkills,
  destroyUserSkill,
};
