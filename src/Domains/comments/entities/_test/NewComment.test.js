const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const newCommentPayload = {
      threadId: 'nice',
      content: 'okay',
    };

    // Action & Assert
    expect(() => new NewComment(newCommentPayload)).toThrow(
      'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const newCommentPayload = {
      threadId: 123,
      content: {},
      owner: true,
    };

    // Action & Assert
    expect(() => new NewComment(newCommentPayload)).toThrow(
      'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create NewComment object correctly', () => {
    // Arrange
    const newCommentPayload = {
      threadId: 'thread-992',
      content: 'Madu obat mujarab cuii',
      owner: 'user-23908e',
    };

    // Action
    const { threadId, content, owner } = new NewComment(newCommentPayload);

    // Assert
    expect(threadId).toEqual(newCommentPayload.threadId);
    expect(content).toEqual(newCommentPayload.content);
    expect(owner).toEqual(newCommentPayload.owner);
  });
});
