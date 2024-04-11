const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchastrating the delete comment action correctly', async () => {
    // Arrange
    const useCaseCredential = {
      id: 'user-123',
    };
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const expectedDeletedComment = {
      commentId: useCaseParam.commentId,
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

    mockCommentRepository.deleteCommentById = jest.fn().mockImplementation(() => Promise.resolve());

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
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
      expectedDeletedComment.commentId,
    );
  });
});
