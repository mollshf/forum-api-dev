const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchastrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'this is content',
    };

    const useCaseCredential = {
      id: 'userA',
    };

    const useCaseParam = {
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCaseCredential.id,
    });

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /* mocking needed functions */
    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyExistingComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReply));

    /* creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(
      useCaseCredential,
      useCaseParam,
      useCasePayload,
    );

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.verifyExistingComment).toBeCalledWith(useCaseParam);

    expect(mockReplyRepository.addReply).toBeCalledWith(
      new NewReply({
        commentId: useCaseParam.commentId,
        content: useCasePayload.content,
        owner: useCaseCredential.id,
      }),
    );
  });
});
