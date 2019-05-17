class Ball {
    constructor(world, x, y, radius) {
        this.world = world;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.w = this.radius*2;
        this.h = this.radius*2; // necessary for all actors to have x,y,w,h to make generic collision detection possible in util.areColliding()
        this.color = "white";
        this.velocity = [200, -250];
        this.resting = true;
    }
    init(paddle, brickContainer) {
        this.paddle = paddle;
        this.brickContainer = brickContainer;
    }
    initialPosition() {
            if (this.resting) {
                this.x = this.paddle.x;
            this.y = this.paddle.y - this.paddle.h; 
        }
    }
    // prevent ball from moving faster diagonally, not implemented right now, bc not working as expected
    // get directionClamp() { 
    //     if (Math.abs(this.velocity[0]) + Math.abs(this.velocity[1]) > 1) {
    //         const normalized = util.normalize(this.velocity);
    //         return util.normalize(this.velocity);
    //     }
    //     return this.velocity;
    // }
    render() {
        this.initialPosition();
        this.world.ctx.beginPath();
        this.world.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.world.ctx.fillStyle = this.color; 
        this.world.ctx.fill();
    }
    moveBy(x, y) {
        this.x += x;
        this.y += y;
    }
    update(canvas) {
        if (input.status.bounce) { this.resting = false;} // TODO differentiate buttons that are meant to be hold and that are not affected by keyup 
        if (this.resting) return;
        this.paddleCollider();
        this.brickCollider();

        

        const offsetX = (this.velocity[0] /** this.directionClamp[0]*/) / this.world.fps;
        const offsetY = (this.velocity[1] /** this.directionClamp[1]*/) / this.world.fps;
        this.moveBy(offsetX, offsetY);
    }
    brickCollider() { 
        const len = this.brickContainer.bricks.length;
        for (let i = 0; i < len; i++) {
            const brick = this.brickContainer.bricks[i];
            let hitTheBrick = false;

            if (util.areColliding(this, brick))  {
                const relation = util.relativeVector(this, brick);
            
                // TODO fix collision, still wanky
                if(brick.life > 0) {
                    if(relation[1] > 20 && this.velocity[1] < 0) {
                        this.velocity[1] *= -1; 
                        hitTheBrick = true;
                        console.log("hit bottom");
                    } else if(relation[1] < -20 && this.velocity[1] > 0 ) {
                        this.velocity[1] *= -1;
                        hitTheBrick = true;
                        console.log("hit top");
                    } else if(relation[0] > 20 && this.velocity[0] < 0) {
                        this.velocity[0] *= -1;
                        hitTheBrick = true;
                        console.log("hit right");
                    } else if(relation[0] < -20 && this.velocity[0] > 0) {
                        this.velocity[0] *= -1;
                        hitTheBrick = true;
                        console.log("hit left");
                    } 

                    if(hitTheBrick) {
                        this.brickContainer.bricks[i].life = 0;
                        break;
                    }
                } 
            }
        }
    }
    paddleCollider() {
        // returns a vector indicating the position of the ball in relation to the paddle
        const relation = util.normalize(util.relativeVector(this, this.paddle)); 
        if (util.areColliding(this, this.paddle) && this.velocity[1] > 0 && relation[1] < 0) {
            this.velocity[1] *= -1;
        }
    }
}


// TODO think about a dedicated collisionHandler. Every actor in the world could have an array of collidables
// for example the ball collides with paddles and bricks, the paddle also might collide with extra "lifeballs", bricks collide with the ball
// How to prevent duplicate collision checking? - Maybe check all collisions and send messages to affected actors
// for now the ball is the only thing that collides with other things
