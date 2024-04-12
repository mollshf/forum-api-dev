const thread = {
  id: 'bla',
  title: 'bla',
  body: 'bla',
  username: 'n',
  comments: [],
};

const comments = [
  {
    id: 'comment-123',
    username: 'dicoding',
    date: '2021-08-08T07:59:18.982Z',
    content: 'suba',
    isDelete: false,
    replies: [],
  },
  {
    id: 'comment-456',
    username: 'dicoding',
    date: '2021-08-08T07:59:18.982Z',
    content: 'suba',
    isDelete: true,
    replies: [],
  },
  {
    id: 'comment-444',
    username: 'dicoding',
    date: '2021-08-08T07:59:18.982Z',
    content: 'suba',
    isDelete: false,
    replies: [],
  },
];

const replies = [
  {
    id: 'reply-123',
    commentId: 'comment-123',
    username: 'dicoding',
    date: '2021-08-08T07:59:18.982Z',
    content: 'suba',
    isDelete: true,
  },
  {
    id: 'reply-456',
    commentId: 'comment-123',
    username: 'dicoding',
    date: '2021-08-08T07:59:18.982Z',
    content: 'suba',
    isDelete: true,
  },
  {
    id: 'reply-789',
    commentId: 'comment-456',
    username: 'dicoding',
    date: '2021-08-08T07:59:18.982Z',
    content: 'suba',
    isDelete: false,
  },
  {
    id: 'reply-987',
    commentId: 'comment-456',
    username: 'dicoding',
    date: '2021-08-08T07:59:18.982Z',
    content: 'suba',
    isDelete: true,
  },
  {
    id: 'reply-111',
    commentId: 'comment-444',
    username: 'dicoding',
    date: '2021-08-08T07:59:18.982Z',
    content: 'suba',
    isDelete: true,
  },
];

function _changeContentOfComments(arr) {
  return arr.map((data) => {
    if (data.isDelete) {
      data.content = '**komentar telah dihapus**';
    }
    delete data.isDelete;
    return data;
  });
}

function _changeContentOfRepliesComment(comments, replies) {
  let result = [];
  comments.forEach((comment) => {
    comment.replies = replies
      .filter((reply) => reply.commentId === comment.id)
      .map((reply) => ({
        id: reply.id,
        username: reply.username,
        date: reply.date,
        content: reply.isDelete ? '**balasan telah dihapus**' : reply.content,
      }));
    result.push(comment);
  });
  return result;
}

const filteredComments = _changeContentOfComments(comments);
const result = _changeContentOfRepliesComment(filteredComments, replies);

console.log(result);
