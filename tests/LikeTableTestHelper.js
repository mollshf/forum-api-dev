/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeTableTestHelper = {
  async addLike({ id = 'like-123', commentId = 'comment-123', owner = 'user-123' }) {
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
      values: [id, commentId, owner, date],
    };

    await pool.query(query);
  },

  async findLikeByCommentIdAndOwner({ commentId, owner }) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikeTableTestHelper;
