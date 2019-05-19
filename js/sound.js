const audio = {
    sfx: {
        hitBrick: new Audio("sound/bounce.wav"),
        wonGame: new Audio("sound/wonGame.wav")
    },
    tracks: {
        normalMode: new Audio("sound/normalModeTrack.ogg"),
        ramboMode: new Audio("sound/ramboModeTrack.wav")
    },
    init: function() {
        this.tracks.normalMode.loop = true;
        window.addEventListener("keydown", () => this.tracks.normalMode.play(), { once: true });

        messenger.onMessage("hitBrick", () => { this.sfx.hitBrick.play(); });
        messenger.onMessage("enterRambo", () => {
            this.tracks.ramboMode.play();
            this.tracks.normalMode.muted = true;
        });
        this.tracks.ramboMode.addEventListener("ended", () => {
            messenger.send("exitRambo");
            this.tracks.normalMode.muted = false;
        });
        messenger.onMessage("gameEnded", () => {
            this.tracks.ramboMode.pause();
        })
    }
}
