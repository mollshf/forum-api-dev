const ThreadsTableTestHelper = require('../../../../tests/ThreadRepositoryTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    ThreadsTableTestHelper.cleanTable();
    UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread to database', async () => {
      // Arrange

      /** create user */
      await UsersTableTestHelper.addUser({ id: 'user-001', username: 'kcy1' });

      const newThread = new NewThread({
        title: 'this is title',
        body: 'this is body',
        owner: 'user-001',
      });

      /** stub */
      const fakeIdGenerator = () => 'yoyo';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-yoyo');
      console.log(thread);
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange

      /** create user */
      await UsersTableTestHelper.addUser({ id: 'user-002', username: 'kcy1' });

      const newThread = new NewThread({
        title: 'this is title',
        body: 'this is body',
        owner: 'user-002',
      });

      /** stub */
      const fakeIdGenerator = () => 'yoyo';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-yoyo',
          title: 'this is title',
          owner: 'user-002',
        }),
      );
    });
  });

  describe('getThreadById function', () => {
    it('should throw notfounderror when thread not found', async () => {});

    it('should return the thread correctly', async () => {});
  });
});
