const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchastrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'madu is great drink ever',
      body: 'lorem ipsum dolor sit amet',
      owner: 'user-testing',
    };

    const expectedAddedThread = new AddedThread({
      id: 'thread-subaomost23',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /* mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread));

    /* creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload.owner, useCasePayload);

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      }),
    );

    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: 'thread-subaomost23',
        title: useCasePayload.title,
        owner: useCasePayload.owner,
      }),
    );
  });
});
