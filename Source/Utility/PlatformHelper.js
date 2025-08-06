"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class PlatformHelper {
            // This class is meant to encapsulate interactions with the DOM ("Domain Object Model").
            static create() {
                return new PlatformHelper();
            }
            platformableAdd(platformable) {
                var platformableAsDomElement = platformable.toDomElement(this);
                if (platformableAsDomElement != null) {
                    this.divMain.appendChild(platformableAsDomElement);
                }
            }
            platformableHide(platformable) {
                platformable.toDomElement(this).style.display = "none";
            }
            platformableRemove(platformable) {
                var platformableAsDomElement = platformable.toDomElement(this);
                if (platformableAsDomElement != null) {
                    if (platformableAsDomElement.parentElement == this.divMain) {
                        this.divMain.removeChild(platformableAsDomElement);
                    }
                }
            }
            platformableShow(platformable) {
                platformable.toDomElement(this).style.display = null;
            }
            initialize(universe) {
                var divMain = this.divMain;
                if (divMain == null) {
                    var d = document;
                    divMain = d.createElement("div");
                    divMain.id = "divMain";
                    divMain.style.position = "absolute";
                    divMain.style.left = "50%";
                    divMain.style.top = "50%";
                    d.body.appendChild(divMain);
                    this.divMain = divMain;
                }
                var display = universe.display;
                divMain.style.marginLeft = "" + (0 - display.sizeInPixels.x / 2);
                divMain.style.marginTop = "" + (0 - display.sizeInPixels.y / 2);
            }
        }
        GameFramework.PlatformHelper = PlatformHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
