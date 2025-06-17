let board = Array.from({ length: 20 }, () => Array(10).fill(0));
let currentPiece;
let score = 0;
let gameInterval;
let timeInterval;
let gameTime = 180;
const dropInterval = 200; // faster dropping

const pieces = [
  { shape: [[1,1,1,1]], color: 'cyan' },          // I
  { shape: [[0,1,0],[1,1,1]], color: 'purple' },   // T
  { shape: [[1,1],[1,1]], color: 'yellow' },       // O
  { shape: [[1,1,0],[0,1,1]], color: 'red' },      // Z
  { shape: [[0,1,1],[1,1,0]], color: 'green' },    // S
  { shape: [[1,0,0],[1,1,1]], color: 'blue' },     // J
  { shape: [[0,0,1],[1,1,1]], color: 'orange' }    // L
];

const getRandomPiece = () => {
  const p = pieces[Math.floor(Math.random() * pieces.length)];
  return { shape: p.shape.map(r => [...r]), color: p.color, x: 4, y: 0 };
};

const updateScore = (numLines) => {
  score += numLines;
  document.getElementById('score').innerText = `Score: ${score}`;
};

const drawBoard = () => {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      const square = document.createElement('div');
      square.className = 'square';
      square.style.top = `${y * 30}px`;
      square.style.left = `${x * 30}px`;
      if (value) {
        square.style.background = value;
      }
      boardDiv.appendChild(square);
    });
  });

  if (currentPiece) {
    currentPiece.shape.forEach((row, dy) => {
      row.forEach((val, dx) => {
        if (val) {
          const square = document.createElement('div');
          square.className = 'square';
          square.style.top = `${(currentPiece.y + dy) * 30}px`;
          square.style.left = `${(currentPiece.x + dx) * 30}px`;
          square.style.background = currentPiece.color;
          boardDiv.appendChild(square);
        }
      });
    });
  }
};

const canMoveTo = (shape, x, y) => {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j]) {
        const newY = y + i;
        const newX = x + j;
        if (newY >= board.length || newX < 0 || newX >= board[0].length || board[newY][newX]) {
          return false;
        }
      }
    }
  }
  return true;
};

const placePiece = () => {
  currentPiece.shape.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val) board[currentPiece.y + i][currentPiece.x + j] = currentPiece.color;
    });
  });
};

const removeLines = () => {
  let linesToRemove = [];
  board.forEach((row, y) => {
    if (row.every(v => v)) linesToRemove.push(y);
  });
  linesToRemove.forEach(line => {
    board.splice(line, 1);
    board.unshift(Array(10).fill(0));
  });
  updateScore(linesToRemove.length);
};

const update = () => {
  if (canMoveTo(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
    currentPiece.y += 1;
  } else {
    placePiece();
    removeLines();
    currentPiece = getRandomPiece();
    if (!canMoveTo(currentPiece.shape, currentPiece.x, currentPiece.y)) {
      clearInterval(gameInterval);
      clearInterval(timeInterval);
      document.getElementById('score').innerText += ' Game Over!';
    }
  }
  drawBoard();
};

const rotate = () => {
  const newShape = currentPiece.shape[0].map((_, i) => currentPiece.shape.map(row => row[i]).reverse());
  if (canMoveTo(newShape, currentPiece.x, currentPiece.y)) {
    currentPiece.shape = newShape;
  }
};

const move = (dir) => {
  if (canMoveTo(currentPiece.shape, currentPiece.x + dir, currentPiece.y)) {
    currentPiece.x += dir;
  }
};

document.addEventListener('keydown', (e) => {
  if (!gameInterval) return;
  if (e.key === 'ArrowUp') rotate();
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
    board = Array.from({ length: 20 }, () => Array(10).fill(0));
    score = 0;
    gameTime = 180;
    currentPiece = getRandomPiece();
    drawBoard();
    document.getElementById('score').innerText = 'Score: 0';
    document.getElementById('time').innerText = 'Time: 180';
    gameInterval = setInterval(update, dropInterval);
    timeInterval = setInterval(() => {
      gameTime -= 1;
      document.getElementById('time').innerText = `Time: ${gameTime}`;
      if (gameTime <= 0) {
        clearInterval(gameInterval);
        clearInterval(timeInterval);
        document.getElementById('score').innerText += ' Time up!';
      }
    }, 1000);
  }
});
