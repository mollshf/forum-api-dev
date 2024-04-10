const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const addedReplyPayload = {
      id: 'reply-001',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedReply(addedReplyPayload)).toThrow(
      'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const addedReplyPayload = {
      id: 'reply-001',
      content: 123,
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedReply(addedReplyPayload)).toThrow(
      'ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create AddedReply object correctly', () => {
    // Arrange
    const addedReplyPayload = {
      id: 'reply-001',
      content: 'sangat menarik!!',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new AddedReply(addedReplyPayload);

    // Assert
    expect(id).toEqual(addedReplyPayload.id);
    expect(content).toEqual(addedReplyPayload.content);
    expect(owner).toEqual(addedReplyPayload.owner);
  });
});
