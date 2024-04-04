const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadRepositoryTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepository Postgres', () => {
  const userId = 'user-001';
  const threadId = 'thread-001';

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: userId, username: 'userAB' });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
  });
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
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
      const fakeDateGenerator = () => '2024';

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
});
