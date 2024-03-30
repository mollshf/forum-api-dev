/* istanbul ignore file */

const ServerTestHelper = {
  async getResponseOfToken(
    server,
    { username = 'suba', password = 'secret', fullname = 'suba omo' },
  ) {
    const userPayload = {
      username,
      password,
    };

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: { ...userPayload, fullname },
    });

    const authUser = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: userPayload,
    });

    const { accessToken } = JSON.parse(authUser.payload).data;
    return accessToken;
  },
};

module.exports = ServerTestHelper;
