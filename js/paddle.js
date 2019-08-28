class Paddle {
    constructor(world, x, y, w, h) {
        this.x = x;  // * x and y represent the middle of the paddle NOT the top left
        this.y = y;
        this.w = w;
        this.h = h;
        this.world = world;
        this.velocity = 650; // pixels per second
        this.direction = 0; // 1 or -1 if key pressed
    }
    render() {
        this.world.ctx.fillStyle = "white";
        this.world.ctx.fillRect(this.x - this.w/2 + this.h/2, this.y - this.h/2, this.w - this.h, this.h);

        this.world.ctx.beginPath();
        this.world.ctx.arc(this.x - this.w/2 + this.h/2, this.y, this.h/2, 0, Math.PI*2);
        this.world.ctx.fill();
   
        this.world.ctx.beginPath();
        this.world.ctx.arc(this.x + this.w/2 - this.h/2, this.y, this.h/2, 0, Math.PI*2);
        this.world.ctx.fill();
    }
    moveBy(x) {
        this.x += x;
        this.x = Math.min(Math.max(this.x, this.w/2), this.world.w - this.w/2);
    }
    update() {
        if(input.mappings.left.active) this.moveBy(-this.velocity / this.world.fps);
        if(input.mappings.right.active) this.moveBy(this.velocity / this.world.fps);
    }
 }