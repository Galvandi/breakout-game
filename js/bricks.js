class BrickContainer {
    constructor(world) {
        this.world = world;
        this.bricks = [];
        this.margin = 5;
        this.marginTop = 120;
        this.marginSides = 100;
        this.colors = ["crimson", "goldenrod", "forestgreen"];
    }
    get numAliveBricks() {
        return this.bricks.reduce((sum, brick) => (brick.life > 0) ? sum+1 : sum, 0 );
    }
    init(amountX, amountY, life) {
        const availablePixels = this.world.w - (this.margin * (amountX + 1) + this.marginSides*2);
        const blockWidth = availablePixels / amountX;
        const blockHeight = 30; // ! hardcoded blockheight

        for(let y = 0; y < amountY; y++) {
            this.bricks.push([]);
            for(let x = 0; x < amountX; x++) {
                this.bricks.push({ 
                    life: Math.max(Math.round(Math.random()*life), 1),
                    x: x * (blockWidth + this.margin) + this.margin + blockWidth/2 + this.marginSides,
                    y: y * (blockHeight + this.margin) + this.margin + blockHeight/2 + this.marginTop,
                    w: blockWidth,
                    h: blockHeight
                });
            }
        }
    }
    render() {
        const len = this.bricks.length;
        for(let i = 0; i < len; i++) {
            const brick = this.bricks[i];
            if (brick.life > 0) {
                this.drawBrick(brick);
            }
        }
    }
    drawBrick(brick) {
        this.world.ctx.fillStyle = this.colors[brick.life-1];
        this.world.ctx.fillRect(brick.x-brick.w/2, brick.y-brick.h/2, brick.w, brick.h);
        
        this.world.ctx.strokeStyle = "wheat";
        this.world.ctx.lineWidth = 0.75;
        this.world.ctx.strokeRect(brick.x-brick.w/2, brick.y-brick.h/2, brick.w, brick.h);
    }
}

// TODO implement functionality to load bricks out of a .txt file or an array for different levels
// TODO ignore inputs when game is paused
// TODO adjust num of blocks based on viewport width 