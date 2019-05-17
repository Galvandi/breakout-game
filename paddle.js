class Paddle {
    constructor(x, y, w, h, fps, ctx) {
        this.x = x;  // * x and y represent the middle of the paddle NOT the top left
        this.y = y;
        this.w = w;
        this.h = h;
        this.velocity = 150; // pixels per second
        this.direction = 0; // 1 or -1 if key pressed 
        this.fps = fps;
        this.ctx = ctx;
    }
    render() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    }
    moveBy(x) {
        this.x += x;
    }
    update() {
        if(input.status.left) this.moveBy(-200 / this.fps);
        if(input.status.right) this.moveBy(200 / this.fps);

        // console.log(input.status);

    }
 }