document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('#grid');
  const width = 10;
  let squares = Array.from(Array(200).keys()).map(() => document.createElement('div'));

  squares.forEach(square => grid.appendChild(square));

  // Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const tTetrominoes = [lTetromino];
  let currentPosition = 4;
  let currentRotation = 0;

  // Select a random Tetromino and its first rotation
  let random = Math.floor(Math.random()*tTetrominoes.length);
  let current = tTetrominoes[random][currentRotation];

  // Draw the tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino');
    })
  }

  // Undraw the Tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
    })
  }

  // Make the tetromino move down every second
  timerId = setInterval(moveDown, 1000)

  // Move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // Freeze function
  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      // Start a new tetromino falling
      random = Math.floor(Math.random() * tTetrominoes.length);
      current = tTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
    }
  }
})
