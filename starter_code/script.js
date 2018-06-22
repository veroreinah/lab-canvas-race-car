window.onload = function() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  var board;
  var car;
  var obstacles;
  var score;

  document.getElementById("start-button").onclick = function() {
    startGame();
  };

  document.onkeydown = function(e) {
    switch (e.keyCode) {
      case 37:
        car.moveLeft();
        break;
      case 39:
        car.moveRight();
        break;
    }
  };

  function startGame() {
    board = new Board(400, 550);
    car = new Car(175, 440, board.limitLeft, board.limitRight);
    obstacles = [];
    score = 0;

    updateCanvas();
  }

  var prevSec = 0;
  function updateCanvas(time) {
    var currentSec = Math.floor(time / 1000);
    var random = Math.floor(Math.random() * (8 - 2)) + 2;

    if ((currentSec % random) === 0 && (currentSec > (prevSec + 2))) {
      createObstacle();
      prevSec = currentSec;
    }

    // Resetear el canvas
    ctx.clearRect(0, 0, board.width, board.height);

    move();
    draw(ctx);

    if (checkCollision()) {
      gameOver(ctx);
    } else {
      window.requestAnimationFrame(updateCanvas);
    }
  }

  function move() {
    board.move();
    obstacles.forEach(function(o, index) {
      if (!o.move()) {
        // Remove the obstacle from the array when reach the bottom of the canvas
        obstacles.splice(index, 1);
        score++;
      }
    });
  }

  function draw(ctx) {
    board.draw(ctx);
    car.draw(ctx);
    obstacles.forEach(function(o) {
      o.draw(ctx);
    });

    ctx.fillStyle = '#ffffff';
    ctx.font = '24px serif';
    ctx.fillText('Score: ' + score, 60, 30);
  }

  function createObstacle() {
    var maxWidth = board.limitRight - board.limitLeft - car.width - 20;
    obstacles.push(new Obstacle(board.limitLeft, board.limitRight, board.height, maxWidth));
  }

  function checkCollision() {
    var collide = false;
    obstacles.forEach(function(obs) {
      if (obs.posY > 430) {
        if ((obs.posY + obs.height) >= car.posY
            && obs.posY <= (car.posY + car.height)
            && ((obs.posX + obs.width >= car.posX
            && obs.posX + obs.width <= car.posX + car.width)
            || (obs.posX >= car.posX
            && obs.posX <= car.posX + car.width)
            || (car.posX >= obs.posX 
            && car.posX <= obs.posX + obs.width))) {
          collide = true;
        }
      }
    });

    return collide;
  }

  function gameOver(ctx) {
    ctx.save();

    ctx.clearRect(0, 0, board.width, board.height);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign="center";
    ctx.fillStyle = '#880000';
    ctx.font = '48px serif';
    ctx.fillText('Game over!', 200, 200);

    ctx.fillStyle = '#ffffff';
    ctx.fillText('Your final score ' + score, 200, 275);

    ctx.restore();
  }
};
