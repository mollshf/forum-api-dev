const DeleteComment = require('../DeleteComment');

describe('DeleteComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const deleteCommentPayload = {
      id: 'comment-8839',
      owner: 'user-998',
    };

    // Action & Assert
    expect(() => new DeleteComment(deleteCommentPayload)).toThrow(
      'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const deleteCommentPayload = {
      id: 'comment-8839',
      owner: 'user-998',
      threadId: 123,
    };

    // Action & Assert
    expect(() => new DeleteComment(deleteCommentPayload)).toThrow(
      'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create AddedComment object correctly', () => {
    // Arrange
    const deleteCommentPayload = {
      id: 'comment-8839',
      owner: 'user-998',
      threadId: 'thread-123',
    };

    // Action
    const { idThread, threadId, owner } = new DeleteComment(deleteCommentPayload);

    // Assert
    expect(idThread).toEqual(newCommentPayload.idThread);
    expect(owner).toEqual(newCommentPayload.owner);
    expect(threadId).toEqual(newCommentPayload.threadId);
  });
});
