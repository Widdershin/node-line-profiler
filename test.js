const random = () => Math.random()
const board = new Array(128).fill(0).map(() =>
  new Array(128).fill(0).map(random)
);

let sum = 0;

board.forEach(row => {
  row.forEach(item => {
    sum = sum + item;
  });
});

for (let row = 0; row < board.length; row++) {
  for (let col = 0; col < board[row].length; col++) {
    sum = sum + board[row][col];
  }
};
