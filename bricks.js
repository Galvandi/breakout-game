class BrickContainer {
    constructor(world) {
        this.world = world;
        this.bricks = [];
        this.margin = 5;
        this.colors = ["red", "yellow", "green"];
    }
    get numAliveBricks() {
        return this.bricks.reduce((sum, brick) => (brick.life > 0) ? sum+1 : sum, 0 );
    }
    init(amountX, amountY, life) {
        const availablePixels = this.world.w - (this.margin * (amountX + 1));
        const blockWidth = availablePixels / amountX;
        const blockHeight = 40; // ! hardcoded blockheight

        for(let y = 0; y < amountY; y++) {
            this.bricks.push([]);
            for(let x = 0; x < amountX; x++) {
                this.bricks.push({ 
                    life: life,
                    x: x * (blockWidth + this.margin) + this.margin + blockWidth/2,
                    y: y * (blockHeight + this.margin) + this.margin + blockHeight/2, // TODO maybe remove + margin
                    w: blockWidth,
                    h: blockHeight
                });
            }
        }
    }
    render() {
        // console.log(this.numAliveBricks);
        const len = this.bricks.length;
        for(let i = 0; i < len; i++) {
            const brick = this.bricks[i];
            if (brick.life > 0) {
                this.drawBrick(brick);
            }
        }
    }
    drawBrick(brick) {
        this.world.ctx.fillStyle = "green";
        this.world.ctx.fillRect(brick.x-brick.w/2, brick.y-brick.h/2, brick.w, brick.h);
    }
}


// TODO think about having real brick instances instead of the current instanced actor approach
// this would make collision detection easier and less intensive as I wouldnt have to calculate x and y with the position in the array
// with real bricks I could use a flat array as as x and y will be stored inside the individual bricks
// TODO implement functionality to load bricks out of a .txt file for different levels