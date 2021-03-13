"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualSound {
            constructor(soundNameToPlay, isMusic) {
                this.soundNameToPlay = soundNameToPlay;
                this.isMusic = isMusic;
            }
            draw(universe, world, place, entity, display) {
                var soundHelper = universe.soundHelper;
                if (this.isMusic) {
                    soundHelper.soundWithNamePlayAsMusic(universe, this.soundNameToPlay);
                }
                else {
                    soundHelper.soundWithNamePlayAsEffect(universe, this.soundNameToPlay);
                }
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
            // Transformable.
            transform(transformToApply) {
                return this; // todo
            }
        }
        GameFramework.VisualSound = VisualSound;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
