import {randomInt} from "./utility.js";
import {Side} from "./ball.js";

export class Wall {
    constructor(bounds) {
        this.rowCount = 4;
        this.columnCount = 5;
        this.width = bounds.width / 6;
        this.height = bounds.height / 12;
        this.padding = 10;
        this.offsetTop = 30;
        this.offsetLeft = 30;
        this.bricks = [];
        this.totalBricks = 0;
        for (let r = 0; r < this.rowCount; r++) {
            this.bricks[r] = [];

            const newColumn = randomInt(1, 5);
            this.totalBricks += newColumn;
            const offset = this.calculateOffset(newColumn);

            for (let c = 0; c < newColumn; c++) {
                if (c === 0) {
                    this.bricks[r][0] = {x: 0, y: 0, status: 1, offset};
                } else {
                    this.bricks[r][c] = {x: 0, y: 0, status: 1};
                }

            }
        }
    }

    calculateOffset(column) {
        if (column === 1) {
            return 2 * (this.width + this.padding);
        }

        if (column === 3) {
            return (this.width + this.padding);
        }

        return 0;
    }

    collisionDetection(ball) {
        //Collision with Bricks
        for (let r = 0; r < this.rowCount; r++) {
            for (let c = 0; c < this.columnCount; c++) {
                const b = this.bricks[r][c];
                if (b != null) {
                    if (b.status === 1) {
                        const hit = ball.collisionDetection({x: b.x, y: b.y, width: this.width, height: this.height});
                        if (hit) {
                            if (Side.isVertical(hit)) {
                                ball.dy = -ball.dy;
                            } else {
                                ball.dx = -ball.dx;
                            }
                            b.status = 0;
                            return true;
                        }
                    }
                }

            }
        }

        return false;
    }

    draw(ctx) {
        for (let r = 0; r < this.rowCount; r++) {
            for (let c = 0; c < this.columnCount; c++) {
                const b = this.bricks[r][c];
                if (b != null) {
                    if (this.bricks[r][c].status === 1) {
                        const brickX = (c * (this.width + this.padding)) + this.offsetLeft + this.bricks[r][0].offset;
                        const brickY = (r * (this.height + this.padding)) + this.offsetTop;
                        this.bricks[r][c].x = brickX;
                        this.bricks[r][c].y = brickY;
                        ctx.beginPath();
                        ctx.rect(brickX, brickY, this.width, this.height);
                        ctx.fillStyle = "#0095DD";
                        ctx.fill();
                        ctx.closePath();
                    }
                }

            }
        }
    }
}
