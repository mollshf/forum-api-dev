const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threaRepository = new ThreadRepository();

    // Action & Assert
    await expect(threaRepository.addThread({})).rejects.toThrow(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(threaRepository.getTheThreadById('')).rejects.toThrow(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(threaRepository.verifyAvailableThread('')).rejects.toThrow(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
