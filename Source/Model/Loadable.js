"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Loadable {
            constructor(load, unload) {
                this.isLoaded = false;
                this._load = load;
                this._unload = unload;
            }
            finalize(uwpe) {
                this.unload(uwpe);
            }
            initialize(uwpe) {
                this.load(uwpe);
            }
            load(uwpe) {
                if (this.isLoaded == false) {
                    if (this._load != null) {
                        this._load(uwpe);
                    }
                    this.isLoaded = true;
                }
            }
            unload(uwpe) {
                if (this.isLoaded) {
                    if (this._unload != null) {
                        this._unload(uwpe);
                    }
                    this.isLoaded = false;
                }
            }
            updateForTimerTick(uwpe) {
                // Do nothing.
            }
        }
        GameFramework.Loadable = Loadable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
