const {
  client,
  createTables,
  createUser,
  createSkill,
  createUserSkill,
  fetchUserSkills,
  fetchUsers,
  fetchSkills,
  destroyUserSkill,
} = require("./db");

const init = async () => {
  await client.connect();
  await createTables();
  console.log("Tables Created.");

  const [u1, u2, u3] = await Promise.all([
    createUser({ name: "user1", password: "password1" }),
    createUser({ name: "user2", password: "password2" }),
    createUser({ name: "user3", password: "password3" }),
  ]);
  console.log(await fetchUsers());
  console.log("Seeded Users.");

  const [s1, s2, s3] = await Promise.all([
    createSkill({ name: "skill1" }),
    createSkill({ name: "skill2" }),
    createSkill({ name: "skill3" }),
  ]);
  console.log(await fetchSkills());
  console.log("Seeded Skills.");

  const userSkills = await Promise.all([
    createUserSkill({ user_id: u1.id, skill_id: s1.id }),
    createUserSkill({ user_id: u2.id, skill_id: s2.id }),
    createUserSkill({ user_id: u3.id, skill_id: s3.id }),
  ]);
  console.log("Seeded User Skills.");

  console.log(await fetchUserSkills(u1.id));
  await destroyUserSkill({
    id: userSkills[0].id,
    user_id: userSkills[0].user_id,
  });
  console.log("Destroyed skill:", await fetchUserSkills(u1.id));
  //   await client.end();
  //   console.log("Data Seeded.");
};
init();
