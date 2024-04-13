const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchastrating the add thread action correctly', async () => {
    // Arrange

    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };
    const useCaseCredential = {
      id: 'user-123',
    };

    const expectedDeletedReply = {
      replyId: useCaseParam.replyId,
    };

    /* creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /* mocking needed functions */
    mockReplyRepository.verifyExistingReply = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn().mockImplementation(() => Promise.resolve());

    /* creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCaseCredential, useCaseParam);

    // Assert
    expect(mockReplyRepository.verifyExistingReply).toBeCalledWith(useCaseParam);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith({
      replyId: useCaseParam.replyId,
      ownerId: useCaseCredential.id,
    });
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(expectedDeletedReply.replyId);
  });
});
