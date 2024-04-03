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
    it('should add thread to database and return correctly', async () => {
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
      const fakeDateGenerator = () => '2024';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeDateGenerator,
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const getThread = await ThreadsTableTestHelper.findThreadById('thread-yoyo');
      expect(getThread).toHaveLength(1);
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-yoyo',
          title: 'this is title',
          owner: 'user-001',
        }),
      );
    });
  });

  describe('getThreadById function', () => {
    it('should throw notfounderror when thread not found', async () => {
      // Arrange

      /* user test helper */
      await UsersTableTestHelper.addUser({ id: 'user-nfe1' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-nfet1', owner: 'user-nfe1' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getTheThreadById('thread-xyz')).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should return the thread correctly when thread found', async () => {
      // Arrange

      const newThread = {
        id: 'thread-929',
        title: 'valorant',
        body: 'minnasan',
        owner: 'user-forsaken',
        date: '2024',
      };

      const expectedGetThread = {
        id: 'thread-929',
        title: 'valorant',
        body: 'minnasan',
        username: 'jett',
        date: '2024',
      };

      /* user test helper */
      await UsersTableTestHelper.addUser({
        id: 'user-forsaken',
        username: expectedGetThread.username,
      });
      await ThreadsTableTestHelper.addThread(newThread);

      /* instantiate */
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getTheThreadById('thread-929');

      // Assert
      expect(thread).toStrictEqual(expectedGetThread);
    });
  });
});
