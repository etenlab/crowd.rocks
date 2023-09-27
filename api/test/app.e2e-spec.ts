import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ErrorType } from 'src/common/types';

describe('GraphQL (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const delayPromise = new Promise((resolve: (value: void) => void) => {
      setTimeout(() => {
        resolve();
      }, 30000);
    });
    await delayPromise;
  }, 40000);

  afterEach(async () => {
    await app.close();
  });

  it('Test admin login mutation', async () => {
    const queryObj = {
      operationName: 'Login',
      variables: {
        email: 'admin@crowd.rocks',
        password: process.env.ADMIN_PASSWORD || 'asdfasdf',
      },
      query: `
        mutation Login($email: String!, $password: String!) {
          login(input: {email: $email, password: $password}) {
                error
                session {
                  ...SessionFields
                  __typename
              }
              __typename
          }
        }
        fragment SessionFields on Session {
            user_id
            token
            avatar
            avatar_url
            __typename
        }
      `,
    };

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send(queryObj);

    expect(res.status).toEqual(200);
    expect(res.body.data.login.error).toEqual(ErrorType.NoError);
    expect(res.body.data.login.session.user_id).toEqual('1');
    expect(res.body.data.login.session.avatar).toEqual('Admin');
  });
});
