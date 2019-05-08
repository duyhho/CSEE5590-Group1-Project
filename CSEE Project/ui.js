export class Label {
    constructor(text, x, y, font, fillStyle, textAlign = "center") {
        this.text = text;
        this.x = x;
        this.y = y;
        this.font = font;
        this.fillStyle = fillStyle;
        this.textAlign = textAlign;
    }

    draw(ctx) {
        ctx.save();
        ctx.font = this.font;
        ctx.fillStyle = this.fillStyle;
        ctx.textAlign = this.textAlign;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

export class Counter extends Label {
    constructor(title, x, y, value, textAlign = "start") {
        super('', x, y, "16px Arial", "#0095DD", textAlign);
        this.title = title;
        this.value = value;
        this.updateText();
    }

    updateText() {
        this.text = this.title + ": " + this.value;
    }

    increment() {
        this.value++;
        this.updateText();
    }

    decrement() {
        this.value--;
        this.updateText();
    }
}

export class Button {
    /**
     * A button with hover and active states.
     *
     * @param {number} x     - X coordinate of the button.
     * @param {number} y     - Y coordinate of the button.
     * @param {number} width     - Width of the button.
     * @param {number} height     - Height of the button.
     * @param {string} text  - Text on the button.
     * @param {object} colors - Default, hover, and active colors.
     * @param {object} colors.default - Default colors.
     * @param {string} colors.default.top - Top default button color.
     * @param {string?} colors.default.bottom - Bottom default button color.
     *
     * @param {object} colors.hover - Hover colors.
     * @param {string} colors.hover.top - Top hover button color.
     * @param {string?} colors.hover.bottom - Bottom hover button color.
     *
     * @param {object} colors.active - Active colors.
     * @param {string} colors.active.top - Top active button color.
     * @param {string?} colors.active.bottom - Bottom active button color.
     *
     * @param {function} onClick - The function to call when the button is clicked.
     */
    constructor({x, y, width, height, text, colors, onClick}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colors = colors;
        this.text = text;
        this.onClick = onClick;

        this.state = 'default';  // current button state

        this.isClicking = false;
    }

    update(mousePosition, mousePressed) {
        // check for hover
        if (mousePosition.x >= this.x && mousePosition.x <= this.x + this.width &&
            mousePosition.y >= this.y && mousePosition.y <= this.y + this.height) {
            this.state = 'hover';

            // check for click
            if (mousePressed) {
                this.state = 'active';
                this.isClicking = true;
            } else {
                if (typeof this.onClick === 'function' && this.isClicking) {
                    this.onClick();
                }
                this.isClicking = false;
            }
        } else {
            this.isClicking = false;
            this.state = 'default';
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.font = "16px Arial";
        const colors = this.colors[this.state];
        const halfH = this.height / 2;

        // button
        ctx.fillStyle = colors.top;
        ctx.fillRect(this.x, this.y, this.width, halfH);
        ctx.fillStyle = colors.bottom;
        ctx.fillRect(this.x, this.y + halfH, this.width, halfH);

        // text
        const size = ctx.measureText(this.text);
        const x = this.x + (this.width - size.width) / 2;
        const y = this.y + (this.height - 15) / 2 + 12;

        ctx.fillStyle = '#FFF';
        ctx.fillText(this.text, x, y);

        ctx.restore();
    }
}
