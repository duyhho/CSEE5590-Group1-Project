import {clamp} from "./utility.js";

export class Paddle {
    constructor(bounds) {
        this.bounds = bounds;
        this.width = 75;
        this.height = 20;
        this.x = (this.bounds.width - this.width) / 2;
        this.y = this.bounds.height - this.height;
        this.rightPressed = false;
        this.leftPressed = false;

        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") {
                this.rightPressed = true;
            } else if (e.key === "ArrowLeft") {
                this.leftPressed = true;
            }
        }, false);
        document.addEventListener("keyup", (e) => {
            if (e.key === "ArrowRight") {
                this.rightPressed = false;
            } else if (e.key === "ArrowLeft") {
                this.leftPressed = false;
            }
        }, false);


        document.addEventListener("mousemove", (e) => {
            const relativeX = e.clientX - this.bounds.x;
            if (relativeX > 0 && relativeX < this.bounds.width) {
                this.x = clamp(relativeX - this.width / 2, 0, this.bounds.width - this.width);
            }
        }, false);

    }

    get frame() {
        return {x: this.x, y: this.y, width: this.width, height: this.height};
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    update() {
        if (this.rightPressed && this.x < this.bounds.width - this.width) {
            this.x += 7;
        }
        if (this.leftPressed && this.x > 0) {
            this.x -= 7;
        }
    }
}
