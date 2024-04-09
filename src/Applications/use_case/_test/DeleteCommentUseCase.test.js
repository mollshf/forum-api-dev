const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchastrating the delete comment action correctly', async () => {
    // Arrange
    const useCaseCredential = {
      id: 'userA',
    };
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const expectedDeletedComment = {
      id: useCaseParam.commentId,
    };

    /* creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /* mocking needed functions */
    mockCommentRepository.verifyExistingComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

    /* creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCaseCredential, useCaseParam);

    // Assert
    expect(mockCommentRepository.verifyExistingComment).toBeCalledWith(useCaseParam);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith({
      commentId: useCaseParam.commentId,
      ownerId: useCaseCredential.id,
    });
    expect(mockCommentRepository.deleteComment).toBeCalledWith(expectedDeletedComment.id);
  });
});
