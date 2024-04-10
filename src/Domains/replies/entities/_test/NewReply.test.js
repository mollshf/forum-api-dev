const NewReply = require('../NewReply');

describe('NewReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const newReplyPayload = {
      commentId: 'nice',
      content: 'okay',
    };

    // Action & Assert
    expect(() => new NewReply(newReplyPayload)).toThrow('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const newReplyPayload = {
      commentId: 123,
      content: {},
      owner: true,
    };

    // Action & Assert
    expect(() => new NewReply(newReplyPayload)).toThrow(
      'NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create NewReply object correctly', () => {
    // Arrange
    const newReplyPayload = {
      commentId: 'comment-001',
      content: 'Madu obat mujarab cuii',
      owner: 'user-23908e',
    };

    // Action
    const { commentId, content, owner } = new NewReply(newReplyPayload);

    // Assert
    expect(commentId).toEqual(newReplyPayload.commentId);
    expect(content).toEqual(newReplyPayload.content);
    expect(owner).toEqual(newReplyPayload.owner);
  });
});
