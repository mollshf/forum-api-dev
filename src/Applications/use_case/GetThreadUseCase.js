class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getTheThreadById(threadId);
    const comment = await this._commentRepository.getCommentByThreadId(threadId);

    thread.comments = this._changeContentOfComments(comment);

    return thread;
  }

  _changeContentOfComments(arr) {
    return arr.map((data) => {
      if (data.isDelete) {
        data.content = '**komentar telah dihapus**';
      }
      delete data.isDelete;
      return data;
    });
  }

  //   _changeContentOfRepliesComment(arr) {
  //     return arr.map((data) => {
  //       if (data.isDelete) {
  //         data.content = 'dihapus';
  //       }
  //       delete data.isDelete;
  //       return data;
  //     });
  //   }
}

module.exports = GetThreadUseCase;
