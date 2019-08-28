// this object checks what keys are pressed. Actors in the game can lookup if a relevant key is pressed and do their thing.
// actors can also "subscribe" to actions by registering a callback function in case that action happens ( inspired by Observer design pattern )
const input = {
    mappings: {
        left: { key: "a", active: false, type: "axis" },
        right: { key: "d", active: false, type: "axis"},
        bounce: { key: "w", active: false, type: "action", listeners: [], released: true },
        pause: { key: " ", active: false, type: "action", listeners: [], released : true },
        rambo: { key: "r", active: false, type: "action", listeners: [], released: true}
    },
    init: function() {
        this.reverseMappings = {};
        Object.entries(this.mappings).forEach(([key, val]) => this.reverseMappings[val.key] = key);
        this.initListeners();
    },
    initListeners: function() {
        const onAction = (evt) => {
            if(this.reverseMappings[evt.key]) {
                const actionName = this.reverseMappings[evt.key];
                const action = this.mappings[actionName];

                if (action.type === "axis") { action.active = (evt.type === "keydown"); }
                else if (evt.type === "keydown" && action.released) { 
                    action.listeners.forEach( fn => fn());
                    action.active = true; 
                    action.released = false; 
                } else {
                    action.active = false;
                }
                if (evt.type == "keyup" && action.type === "action") { action.released = true; }
            }
        };
        document.addEventListener("keydown", onAction);
        document.addEventListener("keyup", onAction);
    },
    register: function(action, fn) {
        this.mappings[action].listeners.push(fn);
    }
};


// TODO register "axis" actions aswell and pass the axis direction -1, 0 or 1 to the callback
// TODO extend this to a full ingame event system to let actors communicate indirectly 
// TODO ditch this event emitter and only use the generic "messenger" for everything
