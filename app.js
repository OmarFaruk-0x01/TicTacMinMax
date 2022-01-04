var origBoard;
const huPlayer = "0";
const aiPlayer = "X";
const winCombs = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  document.querySelector(".endmessage").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  origBoard.map((id) => {
    cells[id].innerText = "";

    cells[id].style.removeProperty("background-color");
    cells[id].addEventListener("click", turnClick, false);
  });
}

function turnClick(cell) {
  if (typeof origBoard[cell.target.id] === "number") {
    turn(cell.target.id, huPlayer);
    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(cellId, player) {
  origBoard[cellId] = player;
  document.getElementById(cellId).innerText = player;
  let gameWon = checkWon(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWon(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombs.entries()) {
    if (win.every((elm) => plays.indexOf(elm) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }

  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombs[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player === huPlayer ? "green" : "red";
  }
  cells.forEach((cell) => {
    cell.removeEventListener("click", turnClick, false);
  });

  showWiner(gameWon.player === huPlayer ? "You Won!" : "You Lose!");
}

function emptySpots() {
  return origBoard.filter((e) => typeof e === "number");
}

function bestSpot() {
  return minmix(origBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySpots().length === 0) {
    cells.forEach((cell) => {
      cell.style.backgroundColor = "blue";
      cell.removeEventListener("click", turnClick, false);
    });
    showWiner("Tie Game!");
    return true;
  }
  return false;
}

function showWiner(who) {
  document.querySelector(".endmessage").style.display = "block";
  document.querySelector(".endmessage").innerText = who;
}

function minmix(newBoard, player) {
  let avalSpots = emptySpots();

  if (checkWon(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWon(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (avalSpots.length === 0) {
    return { score: 0 };
  }

  var moves = [];
  avalSpots.forEach((empSpots, index) => {
    // console.log(index, "index");
    var move = {};
    move.index = newBoard[avalSpots[index]];
    newBoard[avalSpots[index]] = player;

    if (player === aiPlayer) {
      var result = minmix(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minmix(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[avalSpots[index]] = move.index;
    moves.push(move);
  });

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -Infinity;
    moves.forEach((move, i) => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = i;
      }
    });
  } else {
    var bestScore = Infinity;
    moves.forEach((move, i) => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = i;
      }
    });
  }

  return moves[bestMove];
}
