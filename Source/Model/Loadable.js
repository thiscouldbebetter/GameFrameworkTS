"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class LoadableProperty {
            constructor(load, unload) {
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
            propertyName() { return LoadableProperty.name; }
            updateForTimerTick(uwpe) {
                // Do nothing.
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.LoadableProperty = LoadableProperty;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
