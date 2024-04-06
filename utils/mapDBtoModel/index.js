// mapping get all comments
const mapViewCommentData = ({ id, content, date, username, is_delete }) => ({
  id,
  content,
  date,
  username,
  isDelete: is_delete,
});

module.exports = { mapViewCommentData };
