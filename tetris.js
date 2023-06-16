let board = Array.from({ length: 20 }, () => Array(10).fill(0));
let currentPiece;
let score = 0;
let gameInterval;
let timeInterval;
let gameTime = 180;

const pieces = [
  [[1, 1, 1, 1]], // I
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 1], [1, 1]], // O
  [[1, 1, 0], [0, 1, 1]], // Z
  [[0, 1, 1], [1, 1]], // S
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]] // L
];

const getRandomPiece = () => {
  return pieces[Math.floor(Math.random() * pieces.length)];
}

const updateScore = (numLines) => {
  score += numLines;
  document.getElementById('score').innerText = `Score: ${score}`;
}

const drawBoard = () => {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      const square = document.createElement('div');
      square.className = 'square';
      square.style.top = `${y * 30}px`;
      square.style.left = `${x * 30}px`;

      // Draw the current piece
      if (currentPiece) {
        currentPiece.shape.forEach((pieceRow, pieceY) => {
          pieceRow.forEach((pieceValue, pieceX) => {
            if (pieceValue && x === currentPiece.x + pieceX && y === currentPiece.y + pieceY) {
              square.style.background = 'blue';
            }
          });
        });
      }

      // Draw the settled pieces
      if (value === 1) {
        square.style.background = 'blue';
      }
      boardDiv.appendChild(square);
    });
  });
}


const canMoveTo = (shape, x, y) => {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] && (board[y + i] === undefined || board[y + i][x + j] === undefined || board[y + i][x + j] === 1)) {
        return false;
      }
    }
  }
  return true;
}

const placePiece = (shape, x, y) => {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j]) {
        board[y + i][x + j] = 1;
      }
    }
  }
}

const removeLines = () => {
  let linesToRemove = [];
  board.forEach((row, y) => {
    if (row.every(value => value === 1)) {
      linesToRemove.push(y);
    }
  });
  linesToRemove.forEach((line) => {
    board.splice(line, 1);
    board.unshift(Array(10).fill(0));
  });
  updateScore(linesToRemove.length);
}

const update = () => {
  if (canMoveTo(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
    currentPiece.y += 1;
  } else {
    placePiece(currentPiece.shape, currentPiece.x, currentPiece.y);
    removeLines();
    currentPiece = {shape: getRandomPiece(), x: 5, y: 0};
    if (!canMoveTo(currentPiece.shape, currentPiece.x, currentPiece.y)) {
      clearInterval(gameInterval);
      clearInterval(timeInterval);
      document.getElementById('score').innerText += ' Game Over!'
    }
  }
  drawBoard();
}

const rotate = (shape) => {
  const newShape = shape[0].map((val, index) => shape.map(row => row[index])).reverse();
  if (canMoveTo(newShape, currentPiece.x, currentPiece.y)) {
    currentPiece.shape = newShape;
  }
}

const move = (dir) => {
  if (canMoveTo(currentPiece.shape, currentPiece.x + dir, currentPiece.y)) {
    currentPiece.x += dir;
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') rotate(currentPiece.shape);
  if (e.key === 'ArrowRight') move(1);
  if (e.key === 'ArrowDown') update();
  if (e.key === 'ArrowLeft') move(-1);
});

document.getElementById('start').addEventListener('click', () => {
  if (gameInterval) {
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    gameInterval = null;
  } else {
    currentPiece = {shape: getRandomPiece(), x: 5, y: 0};
    gameInterval = setInterval(update, 500);
    timeInterval = setInterval(() => {
      gameTime -= 1;
      document.getElementById('time').innerText = `Time: ${gameTime}`;
      if (gameTime <= 0) {
        clearInterval(gameInterval);
        clearInterval(timeInterval);
        document.getElementById('score').innerText += ' Time up!'
      }
    }, 1000);
  }
});
