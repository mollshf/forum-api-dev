const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadRepositoryTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ClientError = require('../../../Commons/exceptions/ClientError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgress = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  const userId = 'user-123';
  const threadId = 'thread-123';
  const commentId = 'comment-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId, username: 'userABC' });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
    await CommentTableTestHelper.addcomment({ id: commentId, threadId, owner: userId });
  });
  afterEach(async () => {
    await LikeTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await LikeTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addLike function', () => {
    it('should add reply to database', async () => {
      // Arrange
      const newLike = new NewLike({
        commentId,
        owner: userId,
      });

      /* stub function */
      const fakeIdGenerator = () => 'gnrtrlike';
      const fakeDateGenerator = jest.fn(() => new Date('2024-04-12T00:00:00.000Z'));

      /* instantiate the repository class */
      const likeRepositoryPostgres = new LikeRepositoryPostgress(
        pool,
        fakeIdGenerator,
        fakeDateGenerator,
      );

      // Action
      await likeRepositoryPostgres.addLike(newLike);
      const resultLike = await LikeTableTestHelper.findLikeByCommentIdAndOwner(newLike);

      // Assert
      expect(resultLike).toStrictEqual({
        id: 'like-gnrtrlike',
        comment_id: commentId,
        owner: userId,
        date: '2024-04-12T00:00:00.000Z',
      });
    });
  });

  describe('verifyExistingLike function', () => {
    it('should return true if the user liked the commment', async () => {
      // Arrange
      /* creating new like */
      await LikeTableTestHelper.addLike({});

      /* instantiate LikeRepository class */
      const likeRepositoryPostgres = new LikeRepositoryPostgress(pool, {}, {});

      // Action & Assert
      const resultStatus = await likeRepositoryPostgres.verifyExistingLike({
        commentId: 'comment-123',
        owner: 'user-123',
      });

      expect(resultStatus).toEqual(true);
    });

    it('should return false if the user has not liked the comment yet', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgress(pool, {}, {});

      // Action
      const resultStatus = await likeRepositoryPostgres.verifyExistingLike({
        commentId: 'comment-xxx',
        owner: 'user-xxx',
      });

      // Assert
      expect(resultStatus).toEqual(false);
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('should count the number of users who liked the comment 1', async () => {
      // Arrange
      await LikeTableTestHelper.addLike({});

      const likeRepositoryPostgres = new LikeRepositoryPostgress(pool, {}, {});

      // Action
      const resultCount = await likeRepositoryPostgres.getLikeCountByCommentId(commentId);

      //Assert
      expect(resultCount).toEqual(1);
    });

    it('should count the number of users who liked the comment 2', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgress(pool, {}, {});

      // Action
      const resultCount = await likeRepositoryPostgres.getLikeCountByCommentId(commentId);

      //Assert
      expect(resultCount).toEqual(0);
    });
  });

  describe('deletLikeByCommentIdAndOwner function', () => {
    it('should successfully resolve when deleting like', async () => {
      // Arrange
      await LikeTableTestHelper.addLike({});

      const likeRepositoryPostgres = new LikeRepositoryPostgress(pool, {}, {});

      // Action & Assert
      await expect(
        likeRepositoryPostgres.deleteLikeByCommentIdAndOwner({ commentId, owner: 'user-123' }),
      ).resolves.not.toThrowError();
    });

    it('should throw an error when attempting to delete a like that does not exist', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgress(pool, {}, {});

      // Action & Assert
      await expect(
        likeRepositoryPostgres.deleteLikeByCommentIdAndOwner({ commentId, owner: 'user-123' }),
      ).rejects.toThrow(new NotFoundError('gagal menghapus like. Like tidak ada.'));
    });
  });
});
