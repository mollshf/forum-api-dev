const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchastrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'this is content',
    };

    const useCaseCredential = {
      id: 'userA',
    };

    const useCaseParam = {
      threadId: 'thread-123',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCaseCredential.id,
    });

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /* mocking needed functions */
    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    /* creating use case instance */
    const addCommentUsecase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUsecase.execute(
      useCaseCredential,
      useCaseParam,
      useCasePayload,
    );

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({
        threadId: useCaseParam.threadId,
        content: useCasePayload.content,
        owner: useCaseCredential.id,
      }),
    );
  });
});
