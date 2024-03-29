const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'madu',
        body: 'madu is honey',
      };

      const server = await createServer(container);

      /* add user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'sova',
          password: 'secret',
          fullname: 'ahmad sova',
        },
      });

      /* login user */
      const responseLogin = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'sova',
          password: 'secret',
        },
      });

      const responseLoginJson = JSON.parse(responseLogin.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: responseLoginJson.data.accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      console.log(responseJson);
      expect(response.statusCode).toEqual(201);
      expect(response.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });
});
