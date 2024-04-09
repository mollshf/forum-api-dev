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

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: { ...userPayload, fullname },
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: userPayload,
    });

    const { id } = JSON.parse(responseUser.payload).data.addedUser;
    const { accessToken } = JSON.parse(responseAuth.payload).data;
    return { accessToken, userId: id };
  },
};

module.exports = ServerTestHelper;
