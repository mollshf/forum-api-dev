const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadPayload) {
    const newThread = new NewThread(threadPayload);

    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
