import db from "../db.server";
import { User } from "~/lib/auth.types";

export async function createUser(values: User) {
  const { email, username, password } = values;
  const userCreated = await db.user.create({
    data: {
      email,
      username,
      password,
    },
  });

  const profile = await db.profile.create({
    data: {
      userId: userCreated.id,
    },
  });

  return profile;
}
