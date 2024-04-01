// const thread = {
//   id: '123',
//   title: 'anime',
//   body: 'ssu',
//   username: 'suba',
//   date: '2024',
// };

// const comment = [
//   {
//     id: 'comment-yksuCoxM2s4MMrZJO-qVD',
//     threadId: 'yo',
//     username: 'dicoding',
//     date: '2021-08-08T07:26:21.338Z',
//     content: 'this is have content aowiwoak',
//     isDelete: false,
//   },
//   {
//     id: 'comment-yksuCoxM2s4MMrZJO-qVD',
//     threadId: 'yo',
//     username: 'dicoding',
//     date: '2021-08-08T07:26:21.338Z',
//     content: 'this is have content',
//     isDelete: false,
//   },
//   {
//     id: 'comment-yksuCoxM2s4MMrZJO-qwwVD',
//     threadId: 'yo',
//     username: 'dicoding',
//     date: '2021-08-08T07:26:21.338Z',
//     content: 'this is have content',
//     isDelete: true,
//   },
//   {
//     id: 'comment-yksuCoxM2s4MMrZJO-qwwVD',
//     threadId: 'yo',
//     username: 'dicoding',
//     date: '2021-08-08T07:26:21.338Z',
//     content: 'this is have content',
//     isDelete: true,
//   },
// ];

// const changeContent = (arr) => {
//   return arr.map((data) => {
//     if (data.isDelete) {
//       data.content = 'dihapus';
//     }
//     delete data.isDelete;
//     return data;
//   });
// };

// thread.comments = changeContent(comment);
// console.log(thread);

// const { isDelete: isDeleteComment, ...filteredComment } = comment[1];

// console.log(filteredComment);
function fake() {
  this.toISOString = () => '2021';
}

function BudiBam() {
  this.hoho = () => 'subara';
}

const year = new fake();
const budiBam = new BudiBam();

console.log(year.toISOString());
console.log(budiBam.hoho());
