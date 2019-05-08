import {Button, Label} from "./ui.js";
import {Game, GameState} from "./game.js";

class BreakoutApp {
    constructor() {
        const canvas = document.getElementById("myCanvas");
        this.ctx = canvas.getContext("2d");
        this.frame = {x: canvas.offsetLeft, y: canvas.offsetTop, width: canvas.width, height: canvas.height};

        // mouse event variables
        this.mousePosition = {
            x: 0,
            y: 0
        };
        canvas.addEventListener('mousemove', (event) => {
            this.mousePosition.x = event.offsetX || event.layerX;
            this.mousePosition.y = event.offsetY || event.layerY;
        });

        this.mousePressed = false;
        canvas.addEventListener('mousedown', () => {
            this.mousePressed = true;
        });
        canvas.addEventListener('mouseup', () => {
            if (this.game) {
                switch (this.game.state) {
                    case GameState.INIT:
                        this.game.start();
                        break;
                    case GameState.GAME_OVER:
                    case GameState.WON:
                        this.game = null;
                        break;
                    default:
                    // Do nothing;
                }
            }
            this.mousePressed = false;
        });

        //
        const playWidth = 100;
        const playHeight = 80;
        this.playButton = new Button({
            x: (canvas.width - playWidth) / 2,
            y: (canvas.height - playHeight) / 2,
            width: playWidth,
            height: playHeight,
            text: "PLAY NOW!",
            colors: {
                'default': {
                    top: '#1879BD',
                },
                'hover': {
                    top: '#2C43EA'
                },
                'active': {
                    top: '#7C14DD'
                }
            },
            onClick: () => {
                this.startGame();
            }
        });

        this.instructionsLabel = new Label(
            "CLICK TO START!",
            (this.frame.width / 2),
            this.frame.height / 2,
            "25px Arial",
            "#42f445");

        this.congratulationsLabel = new Label(
            "YOU WIN!",
            (this.frame.width / 2),
            this.frame.height / 2,
            "25px Arial",
            "#4224f5");

        this.gameOverLabel = new Label(
            "GAME OVER!",
            (this.frame.width / 2),
            this.frame.height / 2,
            "25px Arial",
            "#FF2445");

        this.loop();
    }

    startGame() {
        this.game = new Game(this.frame, 3);
    }

    loop() {
        this.ctx.clearRect(0, 0, this.frame.width, this.frame.height);

        if (this.game) {
            this.game.draw(this.ctx);
            switch (this.game.state) {
                case GameState.INIT:
                    this.instructionsLabel.draw(this.ctx);
                    break;
                case GameState.WON:
                    this.congratulationsLabel.draw(this.ctx);
                    break;
                case GameState.GAME_OVER:
                    this.gameOverLabel.draw(this.ctx);
                    break;
                default:
                // No-op
            }
        } else {
            this.playButton.update(this.mousePosition, this.mousePressed);
            this.playButton.draw(this.ctx);
        }

        requestAnimationFrame(() => this.loop());
    }
}

new BreakoutApp();
