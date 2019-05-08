import {Ball, Side} from "./ball.js";
import {Paddle} from "./paddle.js";
import {Wall} from "./wall.js";
import {Counter} from "./ui.js";

export const GameState = Object.freeze({
    INIT: 0,
    RUNNING: 1,
    GAME_OVER: 2,
    WON: 3
});

export class Game {
    constructor(frame, lives) {
        this.frame = frame;
        this.bounds = {x: 0, y: 0, width: this.frame.width, height: this.frame.height};

        this.ball = new Ball();
        this.paddle = new Paddle(this.frame);
        this.wall = new Wall(this.bounds);
        this.score = new Counter("Score", 8, 20, 0, "start");
        this.lives = new Counter("Lives", this.bounds.width - 8, 20, lives, "end");

        this.reset();
    }

    reset() {
        this.ball.x = this.bounds.width / 2;
        this.ball.y = this.bounds.height - 30;
        this.paddle.x = (this.bounds.width - this.bounds.width) / 2;
        this.ball.dx = 3;
        this.ball.dy = -3;
        this.state = GameState.INIT;
    }

    start() {
        this.state = GameState.RUNNING;
    }

    draw(ctx) {

        this.wall.draw(ctx);
        this.ball.draw(ctx);
        this.paddle.draw(ctx);


        this.score.draw(ctx);
        this.lives.draw(ctx);

        this.update();

    }

    update() {
        if (this.state !== GameState.RUNNING) {
            return;
        }

        if (this.wall.collisionDetection(this.ball)) {
            this.score.increment();
            if (this.score.value === this.wall.totalBricks) {
                this.state = GameState.WON;
            }
        }

        // Collision with paddle
        if (this.ball.collisionDetection(this.paddle.frame) === Side.TOP) {
            this.ball.dy = -this.ball.dy;
        }

        //Check for collision with walls
        let side = this.ball.collisionDetection(this.bounds, true);
        if (side) {
            if (side === Side.BOTTOM) {
                this.lives.decrement();
                if (this.lives.value <= 0) {
                    this.state = GameState.GAME_OVER;
                } else {
                    //alert("Live Lost!");
                    this.reset();
                }
            } else if (side % 2) {
                this.ball.dy = -this.ball.dy;
            } else {
                this.ball.dx = -this.ball.dx;
            }
        }

        this.paddle.update();
        this.ball.update();
    }
}
