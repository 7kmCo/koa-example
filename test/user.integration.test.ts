// This is an integration test that uses a graphql-binding to test the APIs by issuing
// calls to the actual server. We should determine how we want to distinguish between the
// different types of tests.
import { GraphQLError } from 'graphql';
import { Container } from 'typedi';

// TODO: If we create an integration test harness, we could make app a global and also load dotenv as part of the setup.
// Needs to happen before you import any models
import { getServer } from '../src/server';
// const server = getServer({mockDBConnection: true});
const server = getServer();

import { Binding } from '../generated/binding';
import { User, UserStatus } from '../src/modules/users/user.model';

let binding: Binding;
let testUser: any;
const key = new Date().getTime().toString();

beforeAll(async done => {
  // TODO: this masks errors when they happen, we should figure out how to spy and call through
  console.error = jest.fn();

  try {
    console.log('start');
    await server.start();
    console.log('started');
  } catch (error) {
    throw new Error(error);
  }

  binding = ((await server.getBinding()) as unknown) as Binding; // TODO: clean this up

  try {
    testUser = await createTestUser();
  } catch (error) {
    throw new Error(error);
  }

  done();
});

afterAll(async done => {
  (console.error as any).mockRestore();
  await server.stop();
  done();
});

describe('Users', () => {
  test('find user by id', async done => {
    console.log('find user by id');
    expect(testUser).toBeTruthy();

    const user = await binding.query.user({ where: { id: String(testUser.id) } }, `{ id }`);

    // If user tries to access a private field, it will throw a console error.
    // We should make sure we always fail tests console errors are encountered
    expect(console.error).not.toHaveBeenCalled();
    expect(user).toBeDefined();
    expect(user.id).toBe(testUser.id);
    done();
  });

  test('createdAt sort', async done => {
    console.log('createdAt sort');
    const users = await binding.query.users(
      { limit: 1, orderBy: 'createdAt_DESC' },
      `{ id firstName}`
    );

    expect(console.error).not.toHaveBeenCalled();
    expect(users).toBeDefined();
    expect(users.length).toBe(1);
    expect(users[0].id).toBe(testUser.id);
    done();
  });

  test('uniqueness failure', async done => {
    console.log('uniqueness failure');
    let error: GraphQLError = new GraphQLError('');
    try {
      await createTestUser();
    } catch (e) {
      error = e as GraphQLError;
    }
    // Note: this test can also surface if you have 2 separate versions of GraphQL installed (which is bad)
    expect(error).toBeInstanceOf(GraphQLError);
    expect(error.message).toContain('duplicate');
    done();
  });
});

async function createTestUser() {
  return binding.mutation.createUser(
    {
      data: {
        email: `goldcaddy${key}@gmail.com`,
        firstName: `first ${key}`,
        lastName: `last ${key}`,
        status: UserStatus.ACTIVE
      }
    },
    `{ id email firstName lastName status }`
  );
}
