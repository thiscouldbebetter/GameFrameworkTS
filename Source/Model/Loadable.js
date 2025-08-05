"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class LoadableProperty extends GameFramework.EntityPropertyBase {
            constructor(load, unload) {
                super();
                this.isLoaded = false;
                this._load = load;
                this._unload = unload;
            }
            static entitiesFromPlace(place) {
                return place.entitiesByPropertyName(LoadableProperty.name);
            }
            static of(entity) {
                return entity.propertyByName(LoadableProperty.name);
            }
            finalize(uwpe) {
                this.unload(uwpe);
            }
            initialize(uwpe) {
                this.load(uwpe, null);
            }
            propertyName() { return LoadableProperty.name; }
            updateForTimerTick(uwpe) {
                // Do nothing.
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // Equatable
            equals(other) { return false; } // todo
            // Loadable.
            load(uwpe, callback) {
                if (this.isLoaded == false) {
                    if (this._load != null) {
                        this._load(uwpe);
                    }
                    this.isLoaded = true;
                }
                return this;
            }
            unload(uwpe) {
                if (this.isLoaded) {
                    if (this._unload != null) {
                        this._unload(uwpe);
                    }
                    this.isLoaded = false;
                }
                return this;
            }
        }
        GameFramework.LoadableProperty = LoadableProperty;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
