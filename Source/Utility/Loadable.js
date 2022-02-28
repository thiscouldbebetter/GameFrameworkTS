"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class LoadableGroup {
            constructor(loadables) {
                this.loadables = loadables;
            }
            load(uwpe, callback) {
                var group = this;
                this.loadables.forEach(loadableToLoad => {
                    loadableToLoad.load(uwpe, (resultChild) => {
                        var areAnyLoadablesStillUnloaded = group.loadables.some(x => x.isLoaded == false);
                        if (areAnyLoadablesStillUnloaded == false) {
                            this.isLoaded = true;
                            callback(this);
                        }
                    });
                });
            }
            unload(uwpe) {
                this.loadables.forEach(x => x.unload(uwpe));
                this.isLoaded = false;
            }
        }
        GameFramework.LoadableGroup = LoadableGroup;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
