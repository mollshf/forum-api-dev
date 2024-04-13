const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadRepositoryTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const MainReply = require('../../../Domains/replies/entities/MainReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  const userId = 'user-123';
  const threadId = 'thread-123';
  const commentId = 'comment-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId, username: 'userABC' });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
    await CommentTableTestHelper.addcomment({ id: commentId, threadId, owner: userId });
  });
  afterEach(async () => {
    await ReplyTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ReplyTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });
  describe('addReply function', () => {
    it('should add reply to database and return correctly', async () => {
      // Arrange
      const newReplyPayload = new NewReply({
        commentId,
        content: 'this is reply content',
        owner: userId,
      });

      /* stub function */
      const fakeIdGenerator = () => 'gnrtrrply';
      const fakeDateGenerator = jest.fn(() => new Date('2024-04-12T00:00:00Z'));

      const expectedAddedReply = new AddedReply({
        id: `reply-${fakeIdGenerator()}`,
        content: newReplyPayload.content,
        owner: newReplyPayload.owner,
      });

      /* instantiate the repository class */
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeDateGenerator,
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReplyPayload);

      // Assert
      const checkReply = await ReplyTableTestHelper.findReplyById(`reply-${fakeIdGenerator()}`);

      expect(checkReply).toHaveLength(1);
      expect(addedReply).toStrictEqual(expectedAddedReply);
    });
  });

  describe('getReplyByThreadId function', () => {
    it('should retrieve all replies associated with a given threadId', async () => {
      // Arrange

      /* first user and comment using above configuration */
      /* second user */
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'userCBA' });
      /* second comment */
      await CommentTableTestHelper.addcomment({ id: 'comment-321', threadId });

      const replyA = {
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'replyA content',
        date: '12042024',
        isDelete: false,
      };
      const replyB = {
        id: 'reply-124',
        commentId: 'comment-321',
        content: 'replyB content',
        date: '13042024',
        isDelete: false,
      };

      const expectedReplias = [
        new MainReply({ ...replyA, username: 'userABC' }),
        new MainReply({ ...replyB, username: 'userCBA' }),
      ];

      await ReplyTableTestHelper.addReply({ ...replyA, owner: 'user-123' });
      await ReplyTableTestHelper.addReply({ ...replyB, owner: 'user-321' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      // Action
      const getReplies = await replyRepositoryPostgres.getReplyByThreadId('thread-123');

      // Assert
      expect(getReplies).toEqual(expectedReplias);
    });
  });

  describe('verifyExistingReply function', () => {
    it('should successfully resolve when the reply exists', async () => {
      // Arrange
      await ReplyTableTestHelper.addReply({ commentId, userId });

      /* Instantiate the repository */
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyExistingReply({ threadId, commentId, replyId: 'reply-123' }),
      ).resolves.not.toThrow();
    });

    it('should throw an error when the reply does not exist ', async () => {
      // Arrange
      /* Instantiate the repository */
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyExistingReply({
          threadId,
          commentId,
          replyId: 'reply-xxx',
        }),
      ).rejects.toThrow(new NotFoundError('Reply tidak ditemukan.'));
    });

    it('should throw an error when the reply is already deleted ', async () => {
      // Arrange
      await ReplyTableTestHelper.addReply({ commentId, userId, isDelete: true });
      /* Instantiate the repository */
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyExistingReply({
          threadId,
          commentId,
          replyId: 'reply-123',
        }),
      ).rejects.toThrow(new NotFoundError('Reply tidak ditemukan.'));
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should successfully resolve when the reply matches its owner', async () => {
      // Arrange
      await ReplyTableTestHelper.addReply({ commentId, owner: userId });

      /* Instantiate the repository */
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner({ replyId: 'reply-123', ownerId: userId }),
      ).resolves.not.toThrow();
    });

    it('should fail when the reply does not match its owner', async () => {
      // Arrange
      await ReplyTableTestHelper.addReply({ commentId, owner: userId });

      /* Instantiate the repository */
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner({
          replyId: 'reply-123',
          ownerId: 'user-xxx',
        }),
      ).rejects.toThrow(new NotFoundError('Anda tidak berhak mengakses reply ini.'));
    });
  });

  describe('deleteReplyById function', () => {
    it('should execute reply deletion without errors', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});
      await ReplyTableTestHelper.addReply({});

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReplyById('reply-123')).resolves.not.toThrow();
    });

    it('should throw an error if the reply has already been deleted', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReplyById('reply-123')).rejects.toThrowError(
        new NotFoundError('Gagal menghapus, reply tidak ditemukan.'),
      );
    });
  });
});
