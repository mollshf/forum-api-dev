const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadRepositoryTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const MainComment = require('../../../Domains/comments/entities/MainComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepository Postgres', () => {
  const userId = 'user-123';
  const threadId = 'thread-001';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId, username: 'userAB' });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
  });
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should add comment to database and return correctly', async () => {
      // Arrange
      const newCommentPayload = new NewComment({
        threadId,
        content: 'comment-content',
        owner: userId,
      });

      /* stub function */
      const fakeIdGenerator = () => 'gntrcmnt';
      const fakeDateGenerator = jest.fn(() => new Date('2024-04-12T00:00:00Z'));

      const expectedAddedComment = new AddedComment({
        id: `comment-${fakeIdGenerator()}`,
        content: newCommentPayload.content,
        owner: newCommentPayload.owner,
      });

      /* instantiate the repository class */
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeDateGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newCommentPayload);

      // Assert
      const checkComment = await CommentTableTestHelper.findCommentById(
        `comment-${fakeIdGenerator()}`,
      );

      expect(checkComment).toHaveLength(1);
      expect(addedComment).toStrictEqual(expectedAddedComment);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should retrieve the correct comment by thread id', async () => {
      // Arrange
      const firstComment = {
        id: 'comment-101',
        content: 'sage is duelist not healer',
        date: '2023',
        replies: [],
        isDelete: false,
        likeCount: 0,
      };
      const secondComment = {
        id: 'comment-102',
        content: 'jett is healer not controller',
        date: '2024',
        replies: [],
        isDelete: false,
        likeCount: 0,
      };

      /* Create some comments */
      await CommentTableTestHelper.addcomment(firstComment);
      await CommentTableTestHelper.addcomment(secondComment);

      /* Instantiate the repository */
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      // Action
      const getComment = await commentRepositoryPostgres.getCommentByThreadId(threadId);

      // Assert
      expect(getComment).toEqual([
        new MainComment({ ...firstComment, username: 'userAB' }),
        new MainComment({ ...secondComment, username: 'userAB' }),
      ]);
    });

    it('should return an empty array when no comment is found', async () => {
      // Arrange

      /* Instantiate the repository */
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      // Action
      const getComment = await commentRepositoryPostgres.getCommentByThreadId('thread-xxx');

      // Assert
      expect(getComment).toStrictEqual([]);
    });
  });

  describe('verifyExistingComment function', () => {
    it('should successfully resolve when the comment exists', async () => {
      // Arrange
      await CommentTableTestHelper.addcomment({ threadId, owner: userId });

      /* Instantiate the repository */
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyExistingComment({ threadId, commentId: 'comment-123' }),
      ).resolves.not.toThrowError();
    });

    it('should throw an error when the comment does not exist ', async () => {
      // Arrange
      /* Instantiate the repository */
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyExistingComment({
          threadId,
          commentId: 'comment-xxx',
        }),
      ).rejects.toThrow(new NotFoundError('Thread tidak ditemukan.'));
    });

    it('should throw an error when the comment is already deleted ', async () => {
      // Arrange
      await CommentTableTestHelper.addcomment({ threadId, owner: userId, isDelete: true });
      /* Instantiate the repository */
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyExistingComment({
          threadId,
          commentId: 'comment-123',
        }),
      ).rejects.toThrow(new NotFoundError('Comment tidak ditemukan.'));
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should successfully resolve when the comment matches its owner', async () => {
      // Arrange
      await CommentTableTestHelper.addcomment({ threadId, owner: userId });

      /* Instantiate the repository */
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner({ commentId: 'comment-123', ownerId: userId }),
      ).resolves.not.toThrowError();
    });

    it('should fail when the comment does not match its owner', async () => {
      // Arrange
      await CommentTableTestHelper.addcomment({ threadId, owner: userId });

      /* Instantiate the repository */
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner({
          commentId: 'comment-123',
          ownerId: 'user-xxx',
        }),
      ).rejects.toThrow(new AuthorizationError('Anda tidak berhak mengakses comment ini.'));
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete reply without errors and set is_delete to true', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
      await CommentTableTestHelper.addcomment({ threadId, owner: userId });

      // Action & Assert
      await expect(
        commentRepositoryPostgres.deleteCommentById('comment-123'),
      ).resolves.not.toThrowError();

      const checkIsDelete = await CommentTableTestHelper.findCommentById('comment-123');
      expect(checkIsDelete[0].is_delete).toEqual(true);
    });

    it('should throw an error if the comment has already been deleted', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentById('comment-123')).rejects.toThrow(
        new NotFoundError('Gagal menghapus, comment tidak ditemukan.'),
      );
    });
  });
});
