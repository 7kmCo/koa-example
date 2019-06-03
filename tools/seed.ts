import 'reflect-metadata';

import * as Faker from 'faker';
import { Container } from 'typedi';

import { getServer } from '../src/server';
import { UserStatus } from '../src/modules/users/user.model';

const NUM_USERS = 100;

async function seedDatabase() {
  const server = getServer({ container: Container, openPlayground: false });
  await server.start();

  const binding = await server.getBinding();

  for (let index = 0; index < NUM_USERS; index++) {
    const random = new Date()
      .getTime()
      .toString()
      .substring(8, 13);
    const firstName = Faker.name.firstName();
    const lastName = Faker.name.lastName();
    const email = `${firstName
      .substr(0, 1)
      .toLowerCase()}${lastName.toLowerCase()}-${random}@fakeemail.com`;
    const password = new Date().getTime().toString();
    const status = Math.random() > 0.2 ? UserStatus.ACTIVE : UserStatus.INACTIVE;

    try {
      const user = await binding.mutation.createUser(
        {
          data: {
            email,
            firstName,
            lastName,
            password,
            status
          }
        },
        `{ id email createdAt createdById }`
      );

      console.log(user.email);
    } catch (error) {
      console.error(email, error);
    }
  }

  return server.stop();
}

seedDatabase()
  .then(result => {
    console.log(result);
    return process.exit(0);
  })
  .catch(err => {
    console.error(err);
    return process.exit(1);
  });
