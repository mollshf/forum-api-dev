// Array contoh objek
const badCommentPayload = [{ content: 123 }, {}];

// Pilih secara acak satu objek dari array
const randomObject = badCommentPayload[Math.floor(Math.random() * badCommentPayload.length)];

// Tampilkan objek yang dipilih secara acak
console.log(randomObject);
