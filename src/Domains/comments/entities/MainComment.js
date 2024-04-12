class MainComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.content = payload.content;
    this.date = payload.date;
    this.replies = payload.replies;
    this.isDelete = payload.isDelete;
  }

  _verifyPayload(payload) {
    const { id, username, content, date, replies, isDelete } = payload;

    if (!id || !username || !content || !date || !replies || isDelete === undefined) {
      throw new Error('MAIN_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof content !== 'string' ||
      typeof date !== 'string' ||
      !Array.isArray(replies) ||
      typeof isDelete !== 'boolean'
    ) {
      throw new Error('MAIN_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = MainComment;
