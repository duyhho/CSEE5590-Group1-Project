import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-game-engine',
  templateUrl: './game-renderer.component.html',
  styleUrls: ['./game-renderer.component.css'],
})
export class GameRendererComponent implements OnInit, OnDestroy {
  @ViewChild('canvas') canvasRef: ElementRef;

  get canvasElement(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  //
  // get context(): CanvasRenderingContext2D {
  //   return this.canvas.getContext('2d');
  // }

  constructor(private ngZone: NgZone) {

  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => this.run());
  }

  ngOnDestroy() {
  }

  run() {
    const canvas = this.canvasElement;
    const ctx = canvas.getContext('2d');
    let ballRadius = 10;
    let dx = 0;
    let dy = 0;
    const paddleHeight = 20;
    let paddleWidth = 95;
    let paddleX = (canvas.width - paddleWidth) / 2;
    const paddleY = canvas.height - paddleHeight;
    let x = canvas.width / 2;
    let y = paddleY - ballRadius;
    let rightPressed = false;
    let leftPressed = false;
    const brickRowCount = 3;
    const maxbrickColumnCount = 5;
    const brickWidth = canvas.width / 6;
    const brickHeight = canvas.height / 12;
    const brickPadding = 10;
    const brickOffsetTop = 50;
    const brickOffsetLeft = 30;
    let score = 0;
    let scores;
    let lives = 3;
    const gamePaused = true;
    let totalBricks = 0;
    const bricks = [];
    let backgroundMusic;
    let level = 1;
    if(localStorage.getItem('level') !== '1'){
      level = parseInt(localStorage.getItem('level'),10);
    }
    let levelChecker = true;

// Ball transformation
    let ballStatus = 'normal';
    let ballSizeStatus = 'normal';
    let ballPower = 1;

// Paddle Transformation
    let paddleSizeStatus = 'normal';

// Score board
    const boardWidth = 400;
    const boardHeight = 300;
    const boardX = canvas.width / 2 - boardWidth / 2;
    const boardY = canvas.height / 2 - boardHeight / 2;

// Progress Bar
    const maxBarWidth = 250;
    const bar = new progressbar();

    function setMargin(column) {
      let offset;
      if (column === 1) {
        offset = 2 * (brickWidth + brickPadding);
      } else if (column === 3) {
        offset = (brickWidth + brickPadding);
      } else {
        offset = 0;
      }
      return offset;
    }

    for (let r = 0; r < brickRowCount; r++) {
      bricks[r] = [];

      const newColumn = getRandomInt(1, 5);
      // var newColumn = 1;
      setMargin(newColumn);
      console.log('New Column: ' + newColumn);
      // console.log(setMargin(newColumn));

      for (let c = 0; c < newColumn; c++) {
        const randomType = getRandomType();
        if (randomType.type !== 4) {
          console.log('Countable Brick Type: ' + randomType.type);

          totalBricks += randomType.toughness;
          // console.log("Current Required Score: " + totalBricks);
        }
        if (c === 0) {
          bricks[r][0] = {x: 0, y: 0, status: 1, Type: randomType, offset: setMargin(newColumn), glowVal: 0};
        } else {
          bricks[r][c] = {x: 0, y: 0, status: 1, Type: randomType, glowVal: 0};
        }
        if (randomType.type === 5) {
          const PowerUpType = getRandomPowerUp();
          bricks[r][c].powerup = PowerUpType;
          bricks[r][c].powerup.speed = 1;
        }

      }
    }
    console.log('Total Bricks: ' + totalBricks);
    console.log(bricks);
// for(var c=0; c<brickColumnCount; c++) {
//     bricks[c] = [];
//     for(var r=0; r<brickRowCount; r++) {
//         bricks[c][r] = { x: 0, y: 0, status: 1 };
//     }
// }

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    document.addEventListener('mousemove', mouseMoveHandler, false);
// mouse event variables
    const mousePosition = {
      x: 0,
      y: 0
    };
    let mousePressed = false;

    /**
     * Track the user's mouse position on mouse move.
     */
    canvas.addEventListener('mousemove', event => {
      mousePosition.x = event.offsetX || event.layerX;
      mousePosition.y = event.offsetY || event.layerY;
    });

    /**
     * Track the user's clicks.
     */
    canvas.addEventListener('mousedown', event => {
      mousePressed = true;
    });
    canvas.addEventListener('mouseup', event => {
      mousePressed = false;
    });

    function keyDownHandler(e) {
      if (e.key === 'ArrowRight') {
        rightPressed = true;
      } else if (e.key === 'ArrowLeft') {
        leftPressed = true;
      }
    }

    function keyUpHandler(e) {
      if (e.key === 'ArrowRight') {
        rightPressed = false;
      } else if (e.key === 'ArrowLeft') {
        leftPressed = false;
      }
    }

    let checkPaddleMovement = () => {
      if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
      }
      x += dx;
      y += dy;
    };

    function mouseMoveHandler(e) {
      const relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    }

    function collisionDetector() {
      // Collision with bricks
      if (ballSizeStatus === 'large') {
        ballPower = 2;
      } else {
        ballPower = 1;
      }
      if (ballStatus === 'normal') {
        collisionNormal();
      } else if (ballStatus === 'fire') {
        collisionFire();
        // collisionNormal();
      } else {
        collisionNormal();
      }


      //    Collision with walls and paddles

      // Collision with paddle
      if (checkPaddleCollision()) {
        dy = -dy;
      }
      // Check for collision with walls
      switch (checkWallCollision()) {
        case 'side-wall':
          dx = -dx;
          break;
        case 'top-wall':
          dy = -dy;
          break;
        case 'bottom-wall':
          lives--;
          playSound('livelost');
          if (lives <= 0) {
            // alert("GAME OVER");
            lives = 0;
            // document.location.reload();
          } else {
            // alert("Live Lost!");
            reset();
          }
          break;
      }
    }

    function collisionFire() {
      // Collision with Bricks
      for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < maxbrickColumnCount; c++) {
          const b = bricks[r][c];
          if (b) {
            if (b.status === 1) {
              const collisionPoint = checkBrickCollision(b);
              if (collisionPoint !== false) {
                if (b.Type.type === 4) {
                  // if collides with an unbreakable brick
                  playSound('metal');
                  if (collisionPoint === 'left' || collisionPoint === 'right') {
                    dx = -dx;
                  } else if (collisionPoint === 'top' || collisionPoint === 'bottom') {
                    dy = -dy;
                  }
                } else {
                  b.status = 0;
                  score += b.Type.toughness;
                  scores += b.Type.toughness;
                  playSound('brickBurnt');
                }
                // console.log("Collided Brick Type: " + b.type)
                checkBallStatus();
                checkWinStatus();

              }
            } else {
              // console.log("About to call check powerup");
              // console.log(b.powerup);
              const powerupCollisionStatus = checkPowerUpCollision(b);
              if (powerupCollisionStatus === 'paddle') {
                b.powerup.status = 0;
                // alert("collided with powerup");
                if (b.powerup.type === 'fire') {
                  activatePowerUp(b.powerup.type);
                  let timer = b.powerup.timer;
                  if (timer) {
                    clearTimeout(timer); // cancel the previous timer.
                    timer = null;
                  }
                  b.powerup.timer = setTimeout(() => {
                    deactivatePowerUp('fire');
                  }, 5000);
                }
                if (b.powerup.type === 'large') {
                  activatePowerUp(b.powerup.type);
                  let timer = b.powerup.timer;
                  if (timer) {
                    clearTimeout(timer); // cancel the previous timer.
                    timer = null;
                  }
                  b.powerup.timer = setTimeout(() => {
                    deactivatePowerUp('large');
                  }, 5000);
                }
                if (b.powerup.type === 'long') {
                  activatePowerUp(b.powerup.type);
                  let timer = b.powerup.timer;
                  if (timer) {
                    clearTimeout(timer); // cancel the previous timer.
                    timer = null;
                  }
                  b.powerup.timer = setTimeout(() => {
                    deactivatePowerUp('long');
                  }, 5000);
                }
                // console.log(b.powerup);
              } else if (powerupCollisionStatus === 'wall') {
                b.powerup.status = 0;
              }
              // else {
              //     b.powerup.status = 1;
              // }

            }
          }

        }
      }
    }

    function collisionNormal() {
      // Collision with Bricks
      for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < maxbrickColumnCount; c++) {
          const b = bricks[r][c];
          if (b) {
            if (b.status === 1) {
              const collisionPoint = checkBrickCollision(b);
              if (collisionPoint !== false) {
                if (collisionPoint === 'left' || collisionPoint === 'right') {
                  dx = -dx;
                } else if (collisionPoint === 'top' || collisionPoint === 'bottom') {
                  dy = -dy;
                }

                // console.log("Collided Brick Type: " + b.type)
                if (b.Type.type !== 4) { // check whether this is a nonbreakable brick
                  playSound('brickNormal');
                  b.glowVal = 30;
                  if (b.Type.toughness < ballPower) {
                    score += b.Type.toughness;
                    scores += b.Type.toughness;
                    b.Type.toughness = 0;
                  } else {
                    b.Type.toughness -= ballPower;
                    score += ballPower;
                    scores += ballPower;

                  }
                  bar.widths = (maxBarWidth / totalBricks) * score;
                  b.Type.path = getSpritePath(b.Type.type, true);
                  if (b.Type.toughness <= 0) {
                    b.status = 0;
                  }

                  checkBallStatus();
                  checkWinStatus();

                } else {
                  playSound('metal');
                }

              }

            } else {
              // console.log("About to call check powerup");
              // console.log(b.powerup);
              const powerupCollisionStatus = checkPowerUpCollision(b);
              if (powerupCollisionStatus === 'paddle') {
                b.powerup.status = 0;
                // alert("collided with powerup");
                if (b.powerup.type === 'fire') {
                  activatePowerUp(b.powerup.type);
                  let timer = b.powerup.timer;
                  if (timer) {
                    clearTimeout(timer); // cancel the previous timer.
                    timer = null;
                  }
                  b.powerup.timer = setTimeout(() => {
                    deactivatePowerUp('fire');
                  }, 5000);
                }
                if (b.powerup.type === 'large') {
                  activatePowerUp(b.powerup.type);
                  let timer = b.powerup.timer;
                  if (timer) {
                    clearTimeout(timer); // cancel the previous timer.
                    timer = null;
                  }
                  b.powerup.timer = setTimeout(() => {
                    deactivatePowerUp('large');
                  }, 5000);
                }
                if (b.powerup.type === 'long') {
                  activatePowerUp(b.powerup.type);
                  let timer = b.powerup.timer;
                  if (timer) {
                    clearTimeout(timer); // cancel the previous timer.
                    timer = null;
                  }
                  b.powerup.timer = setTimeout(() => {
                    deactivatePowerUp('long');
                  }, 5000);
                }
                // console.log(b.powerup);
              } else if (powerupCollisionStatus === 'wall') {
                b.powerup.status = 0;
              }
              // else {
              //     b.powerup.status = 1;
              // }

            }
          }

        }
      }
    }

    function activatePowerUp(powerup) {
      if (powerup === 'fire') {
        ballStatus = 'fire';
        playSound('fire');
        playSound('fire-voice');
      }
      if (powerup === 'large') {
        ballSizeStatus = 'large';
        playSound('large');
        playSound('large-voice');
      }
      if (powerup === 'long') {
        paddleSizeStatus = 'long';
        playSound('long');
        playSound('long-voice');
      }
    }

    function deactivatePowerUp(powerup) {

      // alert('in deactivate');
      if (powerup === 'fire') {
        ballStatus = 'normal';
      } else if (powerup === 'large') {
        ballSizeStatus = 'normal';
      } else if (powerup === 'long') {
        paddleSizeStatus = 'normal';
      }
      playSound('downgrade');
    }

    function playSound(name) {
      let Sound = null;
      if (name === 'metal') {
        Sound = new sound('./assets/metal.wav');
      } else if (name === 'brickBurnt') {
        Sound = new sound('./assets/explode.wav');
      } else if (name === 'brickNormal') {
        Sound = new sound('./assets/brick.wav');
      } else if (name === 'fire') {
        Sound = new sound('./assets/fire.mp3');
      } else if (name === 'fire-voice') {
        Sound = new sound('./assets/fireball-voice.wav');
      } else if (name === 'large') {
        Sound = new sound('./assets/large.wav');
      } else if (name === 'large-voice') {
        Sound = new sound('./assets/large-voice.wav');
      } else if (name === 'long') {
        Sound = new sound('./assets/long.wav');
      } else if (name === 'long-voice') {
        Sound = new sound('./assets/long-voice.wav');
      } else if (name === 'livelost') {
        Sound = new sound('./assets/livelost.wav');
      } else if (name === 'downgrade') {
        Sound = new sound('./assets/downgrade.wav');
      }
      Sound.play();
    }

    function checkBallStatus() {
      // if (score >= 2){
      //     ballSizeStatus = "large";
      // }
      // if (score >= 4){
      //     ballStatus = "fire";
      // }
    }

    function checkWinStatus() {
      //let scores = score - parseInt(localStorage.getItem('score'),10)
      if (score === totalBricks) {
        return true;
      } else {
        return false;
      }
    }

    function checkBrickCollision(brick) {
      if (x + dx >= brick.x - ballRadius && x + dx <= brick.x + brickWidth + ballRadius) {
        if ((brick.y - ballRadius - Math.abs(dy) <= y + dy) && (y + dy <= brick.y - ballRadius)) {
          // alert('top');
          return 'top';
        } else if ((brick.y + brickHeight + ballRadius + Math.abs(dy) >= y + dy) && (y + dy >= brick.y + brickHeight + ballRadius)) {
          // alert('bottom');
          return 'bottom';
        }
      }
      if (y + dy >= brick.y - ballRadius && y + dy <= brick.y + brickHeight + ballRadius) {
        if ((x + dx >= brick.x - ballRadius - Math.abs(dx)) && (x + dx <= brick.x - ballRadius)) {
          // console.log('left');
          return 'left';
        } else if ((x + dx <= brick.x + brickWidth + ballRadius + Math.abs(dx)) && (x + dx >= brick.x + brickWidth + ballRadius)) {
          // console.log('right');
          return 'right';
        }
      }
      return false;
    }

    function checkPowerUpCollision(brick) {

      // console.log("in check powerupcollision");
      if (brick.status === 0) {
        if (brick.Type.type === 5) {
          if (brick.powerup.status === 1) {
            // console.log("Destroyed Type: " + brick.Type.type);
            // console.log(brick.powerup)
            const powerupY = brick.powerup.y;
            const powerupX = brick.powerup.x;
            const powerupSize = brick.powerup.size;
            // console.log("Current PowerUp X: " + powerupX);
            // console.log("Current Paddle X: " + paddleX + " " + (paddleX+paddleWidth));
            // console.log("Current PowerUp Y: " + powerupY);
            // console.log("Current Paddle Y: " + paddleY);
            // console.log(powerupSize);


            if (powerupX >= paddleX && (powerupX + powerupSize <= paddleX + paddleWidth)) {
              // console.log("within x range!!!")

              if (powerupY + powerupSize >= paddleY) {
                return 'paddle';
              }
            }
            if (powerupY + powerupSize > canvas.height) {
              return 'wall';
            }
          }
        }

      }

    }

    function checkPaddleCollision() {
      // Collision with paddle
      if (y + dy > paddleY - ballRadius) {
        if (x + dx > paddleX - ballRadius && x + dx < paddleX + paddleWidth + ballRadius) {
          return true;
        }
      } else {
        return false;
      }
    }

    function checkWallCollision() {
      // Check for collision with walls
      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        return 'side-wall';
      }
      if (y + dy < ballRadius) {
        return 'top-wall';
      }
      if (y + dy > canvas.height - ballRadius) {

        return 'bottom-wall';
      }
    }

    function drawWall() {

    }

    const backgroundImage = new Image();
    backgroundImage.src = 'assets/background.jpg';

    function drawBackground() {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    const ballImage = new Image();
    ballImage.src = 'assets/ball.png';
    const fireballImage = new Image();
    fireballImage.src = 'assets/fireball.png';

    function drawBall() {
      setGlow(false);
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();
      let image;
      if (ballStatus === 'fire') {
        image = fireballImage;
      } else if (ballStatus === 'normal') {
        image = ballImage;
      }
      if (ballSizeStatus === 'large') {
        ballRadius = 15;
        // img.src = "assets/ball.png";
      } else if (ballSizeStatus === 'normal') {
        ballRadius = 10;
      }
      ctx.drawImage(image, x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2);

    }

    const paddleImage = new Image();
    paddleImage.src = 'assets/paddle1.png';
    const longPaddleImage = new Image();
    longPaddleImage.src = 'assets/paddle2.png';

    function drawPaddle() {
      // ctx.beginPath();
      // ctx.rect(paddleX, paddleY , paddleWidth, paddleHeight);
      // ctx.fillStyle = "#0095DD";
      // ctx.fill();
      // ctx.closePath();
      setGlow(false);
      let img;
      if (paddleSizeStatus === 'normal') {
        img = paddleImage;
        paddleWidth = 95;
      } else if (paddleSizeStatus === 'long') {
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'white';
        ctx.beginPath();
        ctx.rect(paddleX + 10, paddleY + 5, paddleWidth - 10, paddleHeight - 10);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
        img = longPaddleImage;
        paddleWidth = 125;
      }
      ctx.drawImage(img, paddleX, paddleY, paddleWidth, paddleHeight);
    }

    function setGlow(status) {
      if (status === true) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'white';
      } else {
        ctx.shadowBlur = 0;
        ctx.shadowColor = '';
      }
    }

    function drawBricks() {
      for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < maxbrickColumnCount; c++) {
          const b = bricks[r][c];

          if (b) {
            if (b.status === 1) {
              const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft + bricks[r][0].offset;
              const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
              b.x = brickX;
              b.y = brickY;
              if (b.glowVal > 0) {
                // setGlow(false);
                animateGlow(b.glowVal);
                b.glowVal--;
              } else {
                setGlow(true);
              }
              ctx.beginPath();
              ctx.rect(brickX, brickY, brickWidth, brickHeight);
              ctx.fillStyle = b.Type.color;
              ctx.fill();
              ctx.closePath();

              const img = getImage(b.Type.path);
              ctx.drawImage(img, b.x, b.y, brickWidth, brickHeight);


            } else {
              if (b.Type.type === 5) {
                drawPowerUp(b);
                b.powerup.x = b.x + 0.5 * brickWidth - b.powerup.size;
                b.powerup.y = b.y + b.powerup.speed;
                b.powerup.speed += 2;
              }

            }
          }

        }
      }
    }

    function drawPowerUp(brick) {
      if (brick.powerup.status === 1) {
        const powerupDy = brick.powerup.speed;
        if (brick.y + powerupDy <= canvas.height) {
          ctx.beginPath();
          ctx.rect(brick.powerup.x, brick.y + powerupDy, 20, 20);
          ctx.fillStyle = brick.powerup.color;
          ctx.fill();
          ctx.closePath();
        }
      }


    }

    function drawScore() {
      const fontSize = 27;
      ctx.font = fontSize + 'px Arial';
      ctx.fillStyle = '#0095DD';
      ctx.fillText('Score: ' + scores, 8, fontSize);


    }

    const round = (value, n) =>
      parseFloat(`${Math.round(value * Math.pow(10, n)) / Math.pow(10, n)}`).toFixed(n);

    function drawLives() {
      const fontSize = 27;
      ctx.font = fontSize + 'px Arial';
      ctx.fillStyle = '#0095DD';
      ctx.fillText('Lives: ' + lives, canvas.width - fontSize * 4, fontSize);
    }

    function drawScoreBoard() {
      if (lives === 0) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(boardX, boardY, boardWidth, boardHeight);
        ctx.fillStyle = '#0095DD';


        // Board Title
        let fontSize = 35;
        ctx.font = fontSize + 'px Arial';
        ctx.fillStyle = 'red';
        const titleX = boardX + boardWidth / 2 - fontSize * 3;
        const titleY = boardY + boardHeight / 7;
        ctx.fillText('GAME OVER!!!', titleX, titleY);
        ctx.font = '16px Arial';


        // Draw Score within Board
        fontSize = 25;
        ctx.font = fontSize + 'px Arial';
        ctx.fillStyle = 'white';
        const scoreX = boardX + boardWidth / 2 - fontSize * 3;
        const scoreY = boardY + boardHeight / 3;
        ctx.fillText('Your Score: ' + scores, scoreX, scoreY);
        ctx.font = '16px Arial';

        // Play again button
        const playWidth = 150;
        const playHeight = 70;
        const playX = (boardX + (boardWidth - playWidth) * 0.5);
        const playY = (boardY + boardHeight) * 0.8;
        const playText = 'TRY AGAIN';
        localStorage.setItem('level', '1');
        localStorage.setItem('scores', '0');
        const playButton = new Button(playX, playY, playWidth, playHeight, playText, {
          default: {
            top: '#1879BD'
          },
          hover: {
            top: '#2C43EA'
          },
          active: {
            top: '#7C14DD'
          }
        }, () => {
          // console.log(animate);
          console.log('clicked Play');
          canvas.addEventListener('mouseup', () => {
            document.location.reload();
          });
        });

        playButton.update();
        playButton.draw();

        // Paralyze Mouse Movements and Clicks
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mousedown', startGame);

        // disable keyboard movement
        checkPaddleMovement = () => {
        };

        // play sound according to the situation
        if (backgroundMusic) {
          backgroundMusic.stop();
          if (lives === 0) {
            backgroundMusic = new sound('./assets/lose.mp3');
          } else if (checkWinStatus() === true) {
            backgroundMusic = new sound('./assets/win.mp3');
          }
          backgroundMusic.play();
          backgroundMusic = null;
        }

      }
      else if (checkWinStatus()){
        ctx.fillStyle = 'blue';
        ctx.fillRect(boardX, boardY, boardWidth, boardHeight);
        ctx.fillStyle = '#0095DD';

        //level changes
        if(levelChecker == true){
          level = level + 1;
          localStorage.setItem('level', level.toString());
          localStorage.setItem('scores', scores.toString());
        }
        levelChecker = false;

        let fontSize = 35;
        ctx.font = fontSize + 'px Arial';
        ctx.fillStyle = 'red';
        const titleX = boardX + boardWidth / 2 - fontSize * 5 + fontSize / 2;
        const titleY = boardY + boardHeight / 7;
        ctx.fillText('LEVEL COMPLETE!', titleX, titleY);
        ctx.font = '16px Arial';
        //drawClickToStart()
        const playWidth = 150;
        const playHeight = 70;
        const playX = (boardX + (boardWidth - playWidth) * 0.5);
        const playY = (boardY + boardHeight) * 0.8;
        const playText = 'Play level ' + level;



        const playButton = new Button(playX, playY, playWidth, playHeight, playText, {
          default: {
            top: '#1879BD'
          },
          hover: {
            top: '#2C43EA'
          },
          active: {
            top: '#7C14DD'
          }
        }, () => {
          // console.log(animate);
          console.log('clicked Play');
          canvas.addEventListener('mouseup', () => {
            document.location.reload();
          });
        });

        playButton.update();
        playButton.draw();

        // Paralyze Mouse Movements and Clicks
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mousedown', startGame);

        // disable keyboard movement
        checkPaddleMovement = () => {
        };

        // play sound according to the situation
        if (backgroundMusic) {
          backgroundMusic.stop();
          if (lives === 0) {
            backgroundMusic = new sound('./assets/lose.mp3');
          } else if (checkWinStatus() === true) {
            backgroundMusic = new sound('./assets/win.mp3');
          }
          backgroundMusic.play();
          backgroundMusic = null;
        }
      }


    }

    function drawClickToStart() {
      // Ball not moving
      if (dx === 0 && dy === 0) {
        // console.log("in drawClickToStart");
        ctx.font = '25px Arial';
        ctx.fillStyle = '#42f445';
        ctx.fillText('CLICK TO START LEVEL ' + level, x - 25 * 6, canvas.height / 2);
      }

      // requestAnimationFrame(drawClickToStart)

    }

    function drawPlayBtn() {
      ctx.font = '20px Arial';
      const playWidth = 300;
      const playHeight = 80;
      const playX = (canvas.width - playWidth) / 2;
      const playText = 'LET\'S BREAK SOME BRICKS!!';
      const playButton = new Button(playX, (canvas.height - playHeight) / 2, playWidth, playHeight, playText, {
        default: {
          top: '#1879BD'
        },
        hover: {
          top: '#2C43EA'
        },
        active: {
          top: '#7C14DD'
        }
      }, () => {
        animate = () => {
        }; //no need to render the play button anymore
        console.log('clicked Play');
        startGame(null);
      });

      let animate = () => {
        requestAnimationFrame(animate);
        // drawScoreBoard();
        playButton.update();
        playButton.draw();
      };

      requestAnimationFrame(animate);
    }

    function startGame(e) {
      if(localStorage.getItem('level') == '1'){ score = 0;
      scores = 0;
        lives = 3;}
      else{
        scores = parseInt(localStorage.getItem('scores'),10);
        score = 0;
        lives = 3;
      }
      mousePressed = false;
      // Initialize all the necessary sounds
      backgroundMusic = new sound('./assets/music.wav');
      backgroundMusic.playLoop();
      // Start Drawing
      draw();
      canvas.removeEventListener('mousedown', startGame);
      // Reset position
      reset();
    }

    function reset() {
      resetPosition();
      // drawClickToStart();
      canvas.addEventListener('mousedown', resetSpeed);
    }

    function resetPosition() {

      x = canvas.width / 2;
      y = canvas.height - 30;
      paddleX = (canvas.width - paddleWidth) / 2;
      dx = 0;
      dy = 0;
    }

    function resetSpeed(e) {
      mousePressed = false;
      setRandomDirection();
      console.log('dx: ' + dx + ' dy: ' + dy);
      canvas.removeEventListener('mousedown', resetSpeed);
    }

    function draw() {
      if(localStorage.getItem("level") !== '1'){
        level = parseInt(localStorage.getItem("level"),10);
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height); // this can be used as a laser upgrade!
      // drawPlayBtn();
      collisionDetector();
      drawBackground();
      drawBricks();
      drawBall();
      drawPaddle();
      drawScore();
      drawLives();
      drawClickToStart();
      drawProgressBar();
      // drawScoreBoard();

      checkPaddleMovement();
      drawScoreBoard();
      requestAnimationFrame(draw); // Built-in method that paints objects for every frame
    }


    /**
     * Returns a random integer between min (inclusive) and max (inclusive).
     * The value is no lower than min (or the next integer greater than min
     * if min isn't an integer) and no greater than max (or the next integer
     * lower than max if max isn't an integer).
     * Using Math.round() will give you a non-uniform distribution!
     */
// Get random ODD int from min to max
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);

      // console.log("Min: " + min);
      // console.log("Max: " + max);

      let randNum = Math.floor(Math.random() * (max - min + 1)) + min;
      while (randNum % 2 === 0) {
        randNum = Math.floor(Math.random() * (max - min + 1)) + min;
        // console.log("new number: " + randNum);
      }
      return randNum;
    }

// Get random int from min to max
    function getRandomInt2(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);

      // console.log("Min: " + min);
      // console.log("Max: " + max);

      const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
      return randNum;
    }

    const imageCache = {};

    function getImage(path) {
      let image = imageCache[path];
      if (!image) {
        image = new Image();
        image.src = path;
        console.log('loaded image', image, 'from path', path);
        imageCache[path] = image;
      }
      return image;
    }

    function getRandomType() {
      const types = [
        {type: 1, color: '#80ef10', toughness: 1, path: getSpritePath(1, false)},
        {type: 2, color: '#f4f407', toughness: 2, path: getSpritePath(2, false)},
        {type: 3, color: '#ed2009', toughness: 3, path: getSpritePath(3, false)},
        {type: 4, color: '#8c9188', toughness: 100000, path: getSpritePath(4, false)},
        {type: 5, color: '#2ae0ea', toughness: 3, path: getSpritePath(5, false)},

      ];
      // TODO: Set limit for each type

      //

      if(parseInt(localStorage.getItem('level')) == 1)
      {const index = getRandomInt2(0, types.length - 5);
        // var index = 4;
        return types[index];}
        else if(parseInt(localStorage.getItem('level')) == 2)
        {const index = getRandomInt2(0, types.length - 3);
        // var index = 4;
        return types[index];}
        else
        {const index = getRandomInt2(0, types.length - 1);
        // var index = 4;
        return types[index];}

    }

    function getRandomPowerUp() {
      const types = [
        {type: 'fire', size: 20, color: '#ed2009', path: '', status: 1},
        {type: 'large', size: 20, color: '#2ae0ea', path: '', status: 1},
        {type: 'long', size: 20, color: '#52d868', path: '', status: 1},
      ];
      const index = getRandomInt2(0, types.length - 1);
      // var index = 1;
      return types[index];
    }

//    For random layout, check typeof element in the 2D array as "undefined" or not before proceeding to draw it
//    Also, change column and row if possible
//    Remove mouse mechanism if possible. It's too funny
    function getSpritePath(type, isCracked) {
      if (isCracked) {
        return './assets/type' + type + 'cracked.png';
      } else {
        return './assets/type' + type + '.png';
      }

    }

    function setRandomDirection() {
      let randomX = getRandomInt2(-5, 5);
      while (Math.abs(randomX) > 0 && Math.abs(randomX) < 2) {
        randomX = getRandomInt2(-5, 5);
      }
      const randomY = getRandomInt2(4, 6);
      dx = randomX;
      dy = -randomY;
    }

    function animateGlow(val) {
      ctx.shadowColor = 'blue';
      ctx.shadowBlur = val;

    }

// Buttons
    /**
     * A button with hover and active states.
     */
    function Button(buttonX, buttonY, w, h, text, colors, clickCB) {
      this.x = buttonX;
      this.y = buttonY;
      this.width = w;
      this.height = h;
      this.colors = colors;
      this.text = text;

      this.state = 'default';  // current button state

      let isClicking = false;

      /**
       * Check to see if the user is hovering over or clicking on the button.
       */
      this.update = () => {
        // check for hover
        if (mousePosition.x >= this.x && mousePosition.x <= this.x + this.width &&
          mousePosition.y >= this.y && mousePosition.y <= this.y + this.height) {
          this.state = 'hover';

          // check for click
          if (mousePressed) {
            this.state = 'active';

            if (typeof clickCB === 'function' && !isClicking) {
              clickCB();
              isClicking = true;
            }
          } else {
            isClicking = false;
          }
        } else {
          this.state = 'default';
        }
      };

      /**
       * Draw the button.
       */
      this.draw = () => {
        ctx.save();

        const color = this.colors[this.state];
        const halfH = this.height / 2;

        // button
        ctx.fillStyle = color.top;
        ctx.fillRect(this.x, this.y, this.width, halfH);
        ctx.fillStyle = color.bottom;
        ctx.fillRect(this.x, this.y + halfH, this.width, halfH);

        // text
        const size = ctx.measureText(this.text);
        const textX = this.x + (this.width - size.width) / 2;
        const textY = this.y + (this.height - 15) / 2 + 12;

        ctx.fillStyle = '#FFF';
        ctx.fillText(this.text, textX, textY);

        ctx.restore();
      };
    }

    function sound(src) {
      this.sound = document.createElement('audio');
      this.sound.src = src;
      this.sound.setAttribute('preload', 'auto');
      this.sound.setAttribute('controls', 'none');
      this.sound.style.display = 'none';
      document.body.appendChild(this.sound);
      this.play = () => {
        // this.sound.play();
        const promise = this.sound.play();

        if (promise !== undefined) {
          promise.then(_ => {
            // Autoplay started!
          }).catch(error => {
            // Autoplay was prevented.
            // Show a "Play" button so that user can start playback.
          });
        }
      };
      this.playLoop = () => {
        this.sound.loop = true;
        const promise = this.sound.play();

        if (promise !== undefined) {
          promise.then(_ => {
            // Autoplay started!
          }).catch(error => {
            console.log(error);
            // Autoplay was prevented.
            // Show a "Play" button so that user can start playback.
          });
        }
      };
      this.stop = () => {
        this.sound.pause();
      };
    }

// To do list: Set upgrades and drop items


//////////////////////////////////////////////////////////////////////////////////
    drawPlayBtn();
// drawScoreBoard();
// draw();


/////////////////////////////// Progress Bar///////////////////////////////////////
    const particleNo = 10;

    let counter = 0;
    let particles = [];

    function progressbar() {
      this.widths = 0;
      this.hue = 0;
      this.barX = (canvas.width - maxBarWidth) / 2;
      this.barY = 5;
      this.draw = () => {
        ctx.fillStyle = 'hsla(' + this.hue + ', 100%, 40%, 1)';
        ctx.fillRect(this.barX, this.barY, this.widths, 25);
        const grad = ctx.createLinearGradient(0, 0, 0, 130);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = grad;
        ctx.fillRect(this.barX, this.barY, this.widths, 27);

        const fontSize = 27;

        const progressRate = round(((score / totalBricks) * 100), 0);
        ctx.font = fontSize + 'px Arial';
        ctx.fillStyle = 'white';
        if (parseInt(progressRate, 10) >= 100) {
          ctx.fillText('Progress: ' + progressRate + '%', (canvas.width / 2 - fontSize * 3.3), fontSize);
        } else {
          ctx.fillText('Progress: ' + progressRate + '%', (canvas.width / 2 - fontSize * 3), fontSize);
        }
      };
    }

    function particle() {
      this.x = bar.barX + bar.widths;
      this.y = bar.barY;
      this.status = 1;
      this.vx = 0.8 + Math.random() * 1;
      this.v = Math.random() * 5;
      this.g = 1 + Math.random() * 3;
      this.down = false;

      this.draw = () => {
        ctx.fillStyle = 'hsla(' + (bar.hue + 0.3) + ', 100%, 40%, 1)';

        const size = Math.random() * 3;
        // console.log(bar.barX);
        ctx.fillRect(this.x, this.y, size, size);
      };
    }


    function drawProgressBar() {
      counter++;

      bar.hue += 0.8;
      // bar.widths = maxBarWidth;
      if (bar.widths > maxBarWidth) {
        // Reset when time out
        if (counter > 300) {
          bar.hue = 0;
          bar.widths = 0;
          counter = 0;
          particles = [];
        } else {
          bar.hue = 126;
          bar.widths = maxBarWidth;
          bar.draw();
        }
      } else {
        bar.draw();
        for (let i = 0; i < particleNo; i += 10) {
          particles.push(new particle());
        }
      }
      update();
    }

    function update() {
      for (const p of particles) {
        if (p.status === 1) {
          if (p.y <= 40) {
            p.x -= p.vx;
            if (p.down === true) {
              p.g += 0.1;
              p.y += p.g;
            } else {
              if (p.g < 0) {
                p.down = true;
                p.g += 0.1;
                p.y += p.g;
              } else {
                p.y -= p.g;
                p.g -= 0.1;
              }
            }
            p.draw();
          }
        }
      }
    }

  }

}
