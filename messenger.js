// the messenger is used by actors to communicate with each other.
// It is inspired by the Observer design pattern and kinda works like Nodes event emitter system (send == Emitter.emit, addMessage == Emitter.on)
const messenger = {
    listeners: {},
    send: function(message, ...args) {
        this.listeners[message].forEach((fn) => fn(...args));
    },
    onMessage: function(message, fn) {
        // console.log("listener added: ", this.listeners);
        if (!this.listeners[message]) { this.listeners[message] = []; }
        this.listeners[message].push(fn);
    }
}