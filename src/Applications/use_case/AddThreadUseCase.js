const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadPayload, owner) {
    const newThread = new NewThread({ ...threadPayload, owner });

    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
