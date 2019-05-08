import {clamp} from "./utility.js";

export const Side = Object.freeze({
    NONE: 0,
    TOP: 1,
    RIGHT: 2,
    BOTTOM: 3,
    LEFT: 4,
    isVertical(side) {
        return side % 2;
    }
});

export class Ball {
    constructor() {
        this.radius = 10;
        this.x = 0;
        this.y = 0;
        this.dx = 3;
        this.dy = -3;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    collisionDetection(rect, inside = false) {
        const nearestX = clamp(this.x, rect.x, rect.x + rect.width);
        const nearestY = clamp(this.y, rect.y, rect.y + rect.height);
        const deltaX = this.x - nearestX;
        const deltaX2 = deltaX * deltaX;
        const deltaY = this.y - nearestY;
        const deltaY2 = deltaY * deltaY;
        const distance = (deltaX2 + deltaY2);
        if (inside ? distance > 0 : distance < (this.radius * this.radius)) {
            if (deltaX2 < deltaY2) {
                if (nearestY === rect.y) {
                    return Side.TOP;
                }
                return Side.BOTTOM;
            }
            if (nearestX === rect.x) {
                return Side.LEFT;
            }
            return Side.RIGHT;
        }
        return Side.NONE;
    }
}
