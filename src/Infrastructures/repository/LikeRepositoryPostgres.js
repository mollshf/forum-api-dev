const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgress extends LikeRepository {
  constructor(pool, idGenerator, dateGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._dateGenerator = dateGenerator;
  }

  async addLike({ commentId, owner }) {
    const id = `like-${this._idGenerator(16)}`;
    const date = new this._dateGenerator().toISOString();

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, commentId, owner, date],
    };

    await this._pool.query(query);
  }

  async verifyExistingLike({ commentId, owner }) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);
    if (result.rowCount) {
      return true;
    }
    return false;
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*)::integer FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].count;
  }

  async deleteLikeByCommentIdAndOwner({ commentId, owner }) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2 RETURNING id',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('gagal menghapus like. Like tidak ada.');
    }
  }
}

module.exports = LikeRepositoryPostgress;
