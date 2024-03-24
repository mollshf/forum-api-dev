const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload did not contain needen property', () => {
    // Arrange
    const payload = {
      title: 'Pembangunan Perumahan',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrow('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrow('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Manfaat Madu',
      body: 'Madu obat mujarab cuii',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
