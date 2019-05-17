class Game {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.backgroundColor = "black";
        this.playHandler = null;
        this.fps = 60;
        this.playerLife = 5;

        // 
        this.world = { // maybe add all actors to the world so I dont have to reference them everywhere
            canvas: this.canvas,
            ctx: this.ctx,
            fps: this.fps,
            x: this.canvas.width/2,
            y: this.canvas.height/2,
            w: this.canvas.width,
            h: this.canvas.height
        };
        

        // create and init all the actors
        this.paddle = new Paddle(this.world.w/2, this.world.h-20, 150, 20, this.fps, this.ctx);
        this.brickContainer = new BrickContainer(this.world);
        this.ball = new Ball(this.world, this.world.w/2, this.world.h/2, 10);
        this.brickContainer.init(7, 3, 3);
        this.ball.init(this.paddle, this.brickContainer);
    }
    start() {
        this.playHandler = setInterval(() => this.main(), 1000/this.fps);
        input.initListeners();
        // this.initListener();
    }
    clear() {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    update() {
        this.paddle.update();
        this.ball.update();
        this.wallCollider();
    }
    render() {
        this.paddle.render();
        this.ball.render();
        this.brickContainer.render();
    }
    main() {
        this.clear();
        this.update();
        this.render();
    }
    wallCollider() {
        let message = "notColliding";
        if (this.ball.x + this.ball.radius > this.world.w) {
            message = "wallRight";
            this.ball.velocity[0] *= -1;
        } else if (this.ball.x - this.ball.radius < 0) {
            message = "wallLeft";
            this.ball.velocity[0] *= -1;
        } else if (this.ball.y + this.ball.radius > this.world.h) {
            message = "wallBottom";
            this.ball.velocity[1] *= -1;
            this.playerLife--;
            console.log("player lost a life");
            this.ball.resting = true; // resets ball
        } else if (this.ball.y - this.ball.radius < 0) {
            message = "wallTop";
            this.ball.velocity[1] *= -1;
        }
        return message;
    }
}


const game = new Game();
game.start();
