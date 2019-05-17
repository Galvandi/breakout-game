// this object checks what keys are pressed. Actors in the game can lookup if a relevant key is pressed and do their thing.
// for now it's all hardcoded but technically the player could assign keybindings himself if I ever create a settings menu
const input = {
    mappings: {
        left: "a",
        right: "d",
        pause: " ",
        bounce: "w"
    },
    reverseMappings: { // TODO generate this out of the normal mappings later on or use Object.entries with some magic 
        "a": "left",
        "d": "right",
        " ": "pause",
        "w": "bounce",
    },
    status: {
        left: false,
        right: false,
        bounce: false,
        pause: false
    },
    initListeners: function() {
        document.addEventListener("keydown", evt => {
            if(this.reverseMappings[evt.key]) {
                const actionName = this.reverseMappings[evt.key];
                this.status[actionName] = true;
            }
        });
        document.addEventListener("keyup", evt => {
            if(this.reverseMappings[evt.key]) {
                const actionName = this.reverseMappings[evt.key];
                this.status[actionName] = false;
            }
        });
    }
};