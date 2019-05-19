class Ball {
    constructor(world, x, y, radius) {
        this.world = world;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.w = this.radius*2;
        this.h = this.radius*2; // necessary for all actors to have x,y,w,h to make generic collision detection possible in util.areColliding()
        this.color = "white";
        this.velocity = [50, -600];
        this.maxSpeed = 600;
        this.resting = true;
        this.ramboMode = false; // TODO refactor to place the rambomode flag into game class 
    }
    init(paddle, brickContainer) {
        this.paddle = paddle;
        this.brickContainer = brickContainer;
        input.register("bounce", () => {
            this.resting = false;
            this.velocity[0] = Math.random() * 50;
        });
    }
    initialPosition() {
            if (this.resting) {
                this.x = this.paddle.x;
            this.y = this.paddle.y - this.paddle.h/2 - this.radius;
        }
    }
    render() {
        this.initialPosition();
        this.world.ctx.beginPath();
        this.world.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.world.ctx.fillStyle = this.color;
        this.world.ctx.lineWidth = 3;
        if (this.ramboMode) { this.world.ctx.stroke(); }
        else { this.world.ctx.fill(); }
    }
    moveBy(x, y) {
        this.x += x;
        this.y += y;
    }
    update() {
        if (this.resting) return;
        this.wallCollider();
        this.paddleCollider();
        this.brickCollider();

        const norm = util.normalize(this.velocity);
        const ramboMultiplier = this.ramboMode ? 1.25 : 1;
        this.velocity[0] = (this.maxSpeed * norm[0] * ramboMultiplier);
        this.velocity[1] = (this.maxSpeed * norm[1] * ramboMultiplier);

        this.moveBy(this.velocity[0] / this.world.fps, this.velocity[1] / this.world.fps);
    }
    wallCollider() {
        let message = "notColliding";
        if (this.x + this.radius > this.world.w) {
            message = "wallRight";
            this.velocity[0] *= -1;
        } else if (this.x - this.radius < 0) {
            message = "wallLeft";
            this.velocity[0] *= -1;
        } else if (this.y + this.radius > this.world.h) {
            message = "wallBottom";
            this.velocity[1] *= -1;
            messenger.send("playerLostALife");
            this.resting = true;
        } else if (this.y - this.radius < 0) {
            message = "wallTop";
            this.velocity[1] *= -1;
        }
        return message;
    }
    brickCollider() { 
        const len = this.brickContainer.bricks.length;
        for (let i = 0; i < len; i++) {
            const brick = this.brickContainer.bricks[i];
            let hitTheBrick = false;

            if (brick.life)  {
                if(util.areColliding(this, brick)) {
                    const relation = util.relativeVector(this, brick);
                    if(relation[1] > 0 && this.velocity[1] < 0) {
                        this.velocity[1] *= this.ramboMode ? 1 : -1;
                        hitTheBrick = true;
                        // console.log("hit bottom");
                    } else if(relation[1] < 0 && this.velocity[1] > 0 ) {
                        this.velocity[1] *= this.ramboMode ? 1 : -1;
                        hitTheBrick = true;
                        // console.log("hit top");
                    } else if(relation[0] > 0 && this.velocity[0] < 0) {
                        this.velocity[0] *= this.ramboMode ? 1 : -1;
                        hitTheBrick = true;
                        // console.log("hit right");
                    } else if(relation[0] < 0 && this.velocity[0] > 0) {
                        this.velocity[0] *= this.ramboMode ? 1 : -1;
                        hitTheBrick = true;
                        // console.log("hit left");
                    } 

                    if(hitTheBrick) {
                        brick.life = this.ramboMode ? 0 : brick.life-1;
                        messenger.send("playerScore");
                        messenger.send("hitBrick");
                        break;
                    }
                } 
            }
        }
    }
    paddleCollider() {
        // returns a vector indicating the position of the ball in relation to the paddle
        const relation = util.relativeVector(this,this.paddle);
        if (util.areColliding(this, this.paddle) && this.velocity[1] > 0 && relation[1] < 0) {
            // console.log(relation[0]);
            const norm = util.normalize(this.velocity);
            // console.log("ball speed",  Math.abs(this.velocity[0]) + Math.abs(this.velocity[1]));

            this.velocity[1] *= -1;
            this.velocity[0] = (relation[0] / 75) * (this.maxSpeed);

            // this.velocity[1] = this.velocity[1] * norm[1];
            // this.velocity[0] = this.velocity[0] * norm[0];
        }
    }
}


// TODO think about a dedicated collisionHandler. Every actor in the world could have an array of collidables
// for example the ball collides with paddles and bricks, the paddle also might collide with extra "lifeballs", bricks collide with the ball
// How to prevent duplicate collision checking? - Maybe check all collisions and send messages to affected actors
// for now the ball is the only thing that collides with other things
