const ThreadsTableTestHelper = require('../../../../tests/ThreadRepositoryTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const MainThread = require('../../../Domains/threads/entities/MainThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    UsersTableTestHelper.cleanTable();
    ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread to database', async () => {
      // Arrange

      /** create user */
      await UsersTableTestHelper.addUser({ id: 'user-001', username: 'suba' });

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
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange

      /** create user */
      await UsersTableTestHelper.addUser({ id: 'user-002', username: 'omo' });

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
    it('should throw notfounderror when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getTheThreadById('thread-nothread')).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should return the thread correctly', async () => {
      // Arrange

      await UsersTableTestHelper.addUser({
        id: 'user-forsaken',
        username: 'jett',
      });
      await ThreadsTableTestHelper.addThread({ id: 'thread-yoo', title: 'makan' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      const thread = await threadRepositoryPostgres.getTheThreadById('thread-yoo');

      expect(thread).toEqual(
        new MainThread({
          id: 'thread-yoo',
          title: 'makan',
          body: 'sage is duelist not healer',
          date: '2024',
          username: 'jett',
          comments: [],
        }),
      );
    });
  });
});
