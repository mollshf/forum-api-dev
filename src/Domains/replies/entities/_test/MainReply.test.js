const MainReply = require('../MainReply');

describe('MainReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const mainReplyPayload = {
      id: 'reply-001',
      content: 'kerennn!!',
      username: 'user-123',
      date: '2024',
    };

    // Action & Assert
    expect(() => new MainReply(mainReplyPayload)).toThrow('MAIN_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const mainReplyPayload = {
      id: 'reply-001',
      commentId: 123,
      username: 'user-123',
      date: '2024',
      content: 'kerennn!!',
      isDelete: 'false',
    };

    // Action & Assert
    expect(() => new MainReply(mainReplyPayload)).toThrow(
      'MAIN_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create MainReply object correctly', () => {
    // Arrange
    const mainReplyPayload = {
      id: 'reply-001',
      commentId: 'comment-123',
      username: 'user-123',
      date: '2024',
      content: 'kerennn!!',
      isDelete: false,
    };

    // Action
    const { id, commentId, username, date, content, isDelete } = new MainReply(mainReplyPayload);

    // Assert
    expect(id).toEqual(mainReplyPayload.id);
    expect(commentId).toEqual(mainReplyPayload.commentId);
    expect(username).toEqual(mainReplyPayload.username);
    expect(date).toEqual(mainReplyPayload.date);
    expect(content).toEqual(mainReplyPayload.content);
    expect(isDelete).toEqual(mainReplyPayload.isDelete);
  });
});
