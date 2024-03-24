const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Pembangunan Perumahan',
      owner: 'user-subasdfslf23s',
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: {},
      title: 123,
      owner: false,
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-subarshiho12',
      title: 'madu adalah minuman ajaib cui',
      owner: 'user-omoshiroi12',
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread).toBeInstanceOf(AddedThread);
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
