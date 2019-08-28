class Ball {
    constructor(world, x, y, radius) {
        this.world = world;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.w = this.radius*2;
        this.h = this.radius*2;
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
            if (this.resting) {
                this.resting = false;
                this.velocity[0] = Math.random() * 50;
            }
        });
    }
    initialPosition() {
        if (this.resting) {
            this.x = this.paddle.x;
            this.y = this.paddle.y - this.paddle.h/2 - this.radius;
            return true;
        }
        return false;
    }
    render() {
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
        if (this.initialPosition() || this.world.gameInstance.ended) { return; }
        this.wallCollider();
        this.paddleCollider();
        this.brickCollider();

        const norm = util.normalize(this.velocity);
        const ramboMultiplier = this.ramboMode ? 1.45 : 1;
        this.velocity[0] = (this.maxSpeed * norm[0] * ramboMultiplier);
        this.velocity[1] = (this.maxSpeed * norm[1] * ramboMultiplier);

        this.moveBy(this.velocity[0] / this.world.fps, this.velocity[1] / this.world.fps);
    }
    wallCollider() {
        // right, left, bottom, top
        if (this.x + this.radius > this.world.w && this.velocity[0] > 0 ) {
            this.velocity[0] *= -1;
        } else if (this.x - this.radius < 0 && this.velocity[0] < 0) {
            this.velocity[0] *= -1;
        } else if (this.y + this.radius > this.world.h && this.velocity[1] > 0) {
            this.velocity[1] *= -1;
            messenger.send("ballHitBottom");
            this.resting = true;
        } else if (this.y - this.radius < 0 && this.velocity[1] < 0) {
            this.velocity[1] *= -1;
        }
    }
    brickCollider() { 
        const len = this.brickContainer.bricks.length;
        for (let i = 0; i < len; i++) {
            const brick = this.brickContainer.bricks[i];
            // let hitTheBrick = false; // TODO put the hitTheBrick check back, collision sometimes weird without

            if (brick.life)  {
                if(util.areColliding(this, brick)) {
                    const relation = util.relativeVector(this, brick);
                    // check for hit direction bottom, top, right, left
                    if(relation[1] > 0 && this.velocity[1] < 0) { this.velocity[1] *= this.ramboMode ? 1 : -1; } 
                    else if(relation[1] < 0 && this.velocity[1] > 0 ) { this.velocity[1] *= this.ramboMode ? 1 : -1; }
                    else if(relation[0] > 0 && this.velocity[0] < 0) { this.velocity[0] *= this.ramboMode ? 1 : -1; }
                    else if(relation[0] < 0 && this.velocity[0] > 0) { this.velocity[0] *= this.ramboMode ? 1 : -1; }
                    else { console.log("this should never be printed, something wrong with block collisions"); }
                    
                    brick.life = this.ramboMode ? 0 : brick.life-1;
                    messenger.send("playerScore");
                    messenger.send("hitBrick");this.initialPosition()
                    break;
                } 
            }
        }
    }
    paddleCollider() {
        const relation = util.relativeVector(this,this.paddle);
        if (util.areColliding(this, this.paddle) && this.velocity[1] > 0 && relation[1] < 0) {
            this.velocity[1] *= -1;
            this.velocity[0] = (relation[0] / (this.paddle.w * 0.5)) * (this.maxSpeed);
        }
    }
}


// TODO think about a dedicated collisionHandler. Every actor in the world could have an array of collidables
// How to prevent duplicate collision checking? - iterate over every actor that has collidables, if it doesnt have any it cannot collide with anything
// if an actor collides with another actor a message is triggered (maybe a generic damage event with the "this" of the actor passed in)
// actors use something like if (this === hitActor) to check if the were hit
// if performance is an issue, dont use the messenger indirection but use direct communication for collision, something like an actor.hitBy method 
// once an actor hit a collidable we dont have to check that collidable for collisions against that actor 
// 