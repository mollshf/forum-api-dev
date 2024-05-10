const AddLikeUseCase = require('../../../../Applications/use_case/AddLikeUseCase');

class LikeHandler {
  constructor(container) {
    this._container = container;
  }

  async postLikeHandler(request, h) {
    const addLikeUseCase = this._container.getInstance(AddLikeUseCase.name);

    await addLikeUseCase.execute(request.auth.credentials, request.params);

    return {
      status: 'success',
    };
  }
}

module.exports = LikeHandler;
