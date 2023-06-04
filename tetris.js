var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var ROWS = 30;
var COLS = 20;
var BLOCK_SIZE = 20;

var board = [];
for (var r = 0; r < ROWS; r++) {
  board[r] = [];
  for (var c = 0; c < COLS; c++) {
    board[r][c] = 0;
  }
}

var currentPiece = {
  x: 0,
  y: 0,
  shape: [],
  color: ""
};

var pieces = [
  { shape: [[1, 1], [1, 1]], color: "cyan" },
  { shape: [[0, 2, 0], [2, 2, 2]], color: "blue" },
  { shape: [[0, 3, 3], [3, 3, 0]], color: "orange" },
  { shape: [[4, 4, 0], [0, 4, 4]], color: "yellow" },
  { shape: [[5, 5, 5], [0, 5, 0]], color: "green" },
  { shape: [[6, 6, 6, 6]], color: "purple" },
  { shape: [[7, 7], [7, 7]], color: "red" }
];

var score = 0;
var scoreboard = document.getElementById("scoreboard");
scoreboard.style.color = "white";
scoreboard.innerHTML = "Score: " + score;

function newPiece() {
  var i = Math.floor(Math.random() * pieces.length);
  currentPiece.shape = pieces[i].shape;
  currentPiece.color = pieces[i].color;
  currentPiece.x = Math.floor((COLS - currentPiece.shape[0].length) / 2);
  currentPiece.y = 0;
}

function drawBlock(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  ctx.strokeStyle = "black";
  ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      if (board[r][c]) {
        drawBlock(c, r, board[r][c]);
      }
    }
  }
}

function drawPiece() {
  for (var r = 0; r < currentPiece.shape.length; r++) {
    for (var c = 0; c < currentPiece.shape[r].length; c++) {
      if (currentPiece.shape[r][c]) {
        drawBlock(currentPiece.x + c, currentPiece.y + r, currentPiece.color);
      }
    }
  }
}

function movePiece(dx, dy) {
  if (!collision(dx, dy, currentPiece.shape)) {
    currentPiece.x += dx;
    currentPiece.y += dy;
  }
}

function rotatePiece() {
  var newShape = [];
  for (var r = 0; r < currentPiece.shape[0].length; r++) {
    newShape[r] = [];
    for (var c = 0; c < currentPiece.shape.length; c++) {
      newShape[r][c] = currentPiece.shape[currentPiece.shape.length - 1 - c][r];
    }
  }
  if (!collision(0, 0, newShape)) {
    currentPiece.shape = newShape;
  }
}

function collision(dx, dy, shape) {
  for (var r = 0; r < shape.length; r++) {
    for (var c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        var newX = currentPiece.x + c + dx;
        var newY = currentPiece.y + r + dy;
        if (newX < 0 || newX >= COLS || newY >= ROWS || board[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
}

function mergePiece() {
  for (var r = 0; r < currentPiece.shape.length; r++) {
    for (var c = 0; c < currentPiece.shape[r].length; c++) {
      if (currentPiece.shape[r][c]) {
        board[currentPiece.y + r][currentPiece.x + c] = currentPiece.color;
      }
    }
  }
}

function clearRows() {
  for (var r = ROWS - 1; r >= 0; r--) {
    var rowFull = true;
    for (var c = 0; c < COLS; c++) {
      if (board[r][c] == 0) {
        rowFull = false;
        break;
      }
    }
    if (rowFull) {
      for (var y = r; y > 0; y--) {
        for (var c = 0; c < COLS; c++) {
          board[y][c] = board[y - 1][c];
        }
      }
      score += 10;
      scoreboard.innerHTML = "Score: " + score;
      r++;
    }
  }
}

function gameOver() {
  clearInterval(interval);
  var newWindow = window.open("", "_blank");
  newWindow.document.write("<h1>Game Over!</h1>");
  var restartBtn = document.createElement("button");
  restartBtn.innerHTML = "Restart";
  restartBtn.onclick = function() {
    newWindow.close();
    location.reload();
  };
  newWindow.document.body.appendChild(restartBtn);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawPiece();
}

function update() {
  movePiece(0, 1);
  if (collision(0, 1, currentPiece.shape)) {
    mergePiece();
    clearRows();
    newPiece();
    if (collision(0, 0, currentPiece.shape)) {
      gameOver();
    }
  }
}

document.addEventListener("keydown", function(event) {
  switch (event.keyCode) {
    case 37: // left arrow
      movePiece(-1, 0);
      break;
    case 38: // up arrow
      rotatePiece();
      break;
    case 39: // right arrow
      movePiece(1, 0);
      break;
    case 40: // down arrow
      movePiece(0, 1);
      break;
  }
});

newPiece();
var interval = setInterval(function() {
  update();
  draw();
}, 1000 / 5);
