const pool = require('../../database/postgres/pool');

describe('comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });
  it('should response 201 and persisted comment', async () => {
    // Arrange
    const requestPayload = {
      content: 'ini adalah content',
    };
  });
});
