const MainThread = require('../MainThread');

describe('MainThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-subarashi12',
      title: 'madu adalah minuman yang sangat subarashi',
      body: 'anti bakter, anti infeksi',
      username: 'user-omoshiroi12',
      comments: [{}],
    };

    // Action & Assert
    expect(() => new MainThread(payload)).toThrow('MAIN_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 12233,
      title: '12',
      body: true,
      date: 'ds',
      username: true,
      comments: 'dss',
    };

    // Action & Assert
    expect(() => new MainThread(payload)).toThrow('MAIN_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create MainThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-subarashi12',
      title: 'madu adalah minuman yang sangat subarashi',
      body: 'anti bakter, anti infeksi',
      date: `${+new Date()}`,
      username: 'user-omoshiroi12',
      comments: [],
    };

    // Action
    const mainThread = new MainThread(payload);

    // Assert
    expect(mainThread).toBeInstanceOf(MainThread);
    expect(mainThread.id).toEqual(payload.id);
    expect(mainThread.title).toEqual(payload.title);
    expect(mainThread.body).toEqual(payload.body);
    expect(mainThread.date).toEqual(payload.date);
    expect(mainThread.username).toEqual(payload.username);
    expect(mainThread.comments).toEqual(payload.comments);
  });
});
