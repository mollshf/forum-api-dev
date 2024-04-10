class MainReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.commentId = payload.commentId;
    this.username = payload.username;
    this.content = payload.content;
    this.date = payload.date;
    this.isDelete = payload.isDelete;
  }

  _verifyPayload(payload) {
    const { id, commentId, username, content, date, isDelete } = payload;

    if (!id || !commentId || !username || !content || !date || isDelete === undefined) {
      throw new Error('MAIN_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof commentId !== 'string' ||
      typeof username !== 'string' ||
      typeof content !== 'string' ||
      typeof date !== 'string' ||
      typeof isDelete !== 'boolean'
    ) {
      throw new Error('MAIN_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = MainReply;
