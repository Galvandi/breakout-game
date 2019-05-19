class Game {
    constructor() {
        this.canvas = document.getElementById("canvas"); // TODO might aswell remove references outside Game.world
        this.ctx = canvas.getContext("2d");
        this.canvas.width = document.body.clientWidth * 0.8;
        this.canvas.height = document.body.clientHeight * 0.8;
        this.backgroundColor = "black";
        this.playHandler = null;
        this.fps = 60;
        this.playerLife = 2;
        this.playerScore = 0;
        this.ramboScore = 0;
        this.maxRamboScore = 2;
        this.ramboColor = [0,20,20]; // TODO move ramboMode related variables where theyre needed
        this.paused = false;

        this.world = { // maybe add a list of all actors in the world
            canvas: this.canvas,
            ctx: this.ctx,
            fps: this.fps,
            x: this.canvas.width/2,
            y: this.canvas.height/2,
            w: this.canvas.width,
            h: this.canvas.height
        };
        
        // create and init all the actors // TODO maybe move this to an Game.init() method
        this.paddle = new Paddle(this.world, this.world.w/2, this.world.h-20, 120, 20, this.fps, this.ctx);
        this.brickContainer = new BrickContainer(this.world);
        this.ball = new Ball(this.world, this.world.w/2, this.world.h/2, 12.5);
        this.brickContainer.init(25, 4, 3);
        this.ball.init(this.paddle, this.brickContainer);
    }
    main() { 
        this.clear();
        this.checkStatus();
        this.update();
        this.render();
    }
    start() {
        this.playHandler = setInterval(() => this.main(), 1000/this.fps);
        input.init();

        this. registerPauseControl();
        this.normalModeTrack = new Audio("sound/normalModeTrack.ogg");
        this.normalModeTrack.loop = true;       
        window.addEventListener("keydown", () => this.normalModeTrack.play(), { once: true });

        this.ramboModeTrack = new Audio("sound/ramboModeTrack.wav");
        this.ramboModeTrack.addEventListener("ended", () => {
            this.normalModeTrack.muted = false;
            this.ball.ramboMode = false;
        });

        this.hitBrickSound = new Audio("sound/bounce.wav");

        messenger.onMessage("playerLostALife", () => {
            this.playerLife--;
            this.ramboScore = 0;
        });
        messenger.onMessage("playerScore", () => {
            this.playerScore++;
            if(!this.ball.ramboMode) { this.ramboScore = Math.min(this.ramboScore+1, this.maxRamboScore); }
        });
        messenger.onMessage("hitBrick", () => { this.hitBrickSound.play(); });

        input.register("rambo", () => {
            if (!this.ball.ramboMode && this.ramboScore >= this.maxRamboScore) { this.enterRamboMode(); }
        });
    }
    clear() {
        if (this.ball.ramboMode) {
            let rambo = this.ramboColor;
            rambo[0] = rambo[0] <= 200 ? rambo[0] + 11 : 0; // for 200
            this.world.ctx.fillStyle = `rgb(${rambo[0]}, ${rambo[1]}, ${rambo[2]})`;
        } else {
            this.world.ctx.fillStyle = this.backgroundColor;
        }
        this.world.ctx.fillRect(0, 0, this.world.w, this.world.h);
       
    }
    update() {
        this.paddle.update();
        this.ball.update();
        if (this.playerScore > 25) { }
    }
    render() {
        if (this.playerLife <= 0) return;
        this.drawScore();
        this.paddle.render();
        this.ball.render();
        this.brickContainer.render();
    }

    checkStatus() {
        if (this.brickContainer.numAliveBricks === 0) { this.stopGame(true); }
        if (this.playerLife === 0) { this.stopGame(false); }
    }

    stopGame(isWon) {
        clearInterval(this.playHandler);
        this.clear();
        const text = isWon ? "YOU WON" : "GAME OVER";

        this.world.ctx.fillStyle = "grey";
        this.world.ctx.font = "70px Arial";
        this.world.ctx.textAlign = "center";
        this.world.ctx.fillText(text, this.world.x, this.world.y);
        
        
    }
    registerPauseControl() {
        console.log("register pause control")
        input.register("pause", () => {
            console.log("pause");
            if (this.paused) { this.playHandler = setInterval(() => this.main(), 1000/this.fps); }
            else { clearInterval(this.playHandler); }
            this.paused = !this.paused;
        });
    }
    drawScore() {
        this.world.ctx.fillStyle = "grey";
        this.world.ctx.font = "70px Arial";
        this.world.ctx.textAlign = "center";
        this.world.ctx.fillText(this.playerScore, this.world.x, this.world.y);

        // console.log(ramboFontSize, add);

        if (this.ramboScore >= this.maxRamboScore) {        
            this.world.ctx.fillStyle = "red";
            this.world.ctx.font = "30px Arial";
            this.world.ctx.textAlign = "center";
            this.world.ctx.fillText("press R to become Rambo", this.world.x, this.world.y+50); // ! hardcoded rambo mode key 
        }
    }
    enterRamboMode() {
        console.log("enter rambo");
        this.ball.ramboMode = true;
        this.ramboScore = 0;
        this.ramboModeTrack.play();
        this.normalModeTrack.muted = true;
    }
}


const game = new Game();
game.start();


// TODO refactor to use requestAnimationFrame instead of setInterval
// TODO implement replay
// TODO wrap everything in IIFEs and expose only app.js like the instructions demand