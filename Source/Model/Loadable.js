"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Loadable extends GameFramework.EntityProperty {
            constructor(load, unload) {
                super();
                this.isLoaded = false;
                this._load = load;
                this._unload = unload;
            }
            finalize(universe, world, place, entity) {
                this.unload(universe, world, place, entity);
            }
            initialize(universe, world, place, entity) {
                this.load(universe, world, place, entity);
            }
            load(universe, world, place, entity) {
                if (this.isLoaded == false) {
                    if (this._load != null) {
                        this._load(universe, world, place, entity);
                    }
                    this.isLoaded = true;
                }
            }
            unload(universe, world, place, entity) {
                if (this.isLoaded) {
                    if (this._unload != null) {
                        this._unload(universe, world, place, entity);
                    }
                    this.isLoaded = false;
                }
            }
            updateForTimerTick(universe, world, place, entity) {
                // Do nothing.
            }
        }
        GameFramework.Loadable = Loadable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
