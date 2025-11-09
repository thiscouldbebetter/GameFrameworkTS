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
                    this.divDisplay.appendChild(platformableAsDomElement);
                }
            }
            platformableHide(platformable) {
                platformable.toDomElement(this).style.display = "none";
            }
            platformableRemove(platformable) {
                var platformableAsDomElement = platformable.toDomElement(this);
                if (platformableAsDomElement != null) {
                    if (platformableAsDomElement.parentElement == this.divDisplay) {
                        this.divDisplay.removeChild(platformableAsDomElement);
                    }
                }
            }
            platformableShow(platformable) {
                platformable.toDomElement(this).style.display = null;
            }
            initialize(universe) {
                var divDisplay = this.divDisplay;
                if (divDisplay == null) {
                    var d = document;
                    var divDisplay = d.getElementById("divDisplay");
                    if (divDisplay == null) {
                        divDisplay = d.createElement("div");
                        divDisplay.id = "divDisplay";
                    }
                    else {
                        divDisplay.innerHTML = "";
                    }
                    divDisplay.style.position = "absolute";
                    divDisplay.style.left = "50%";
                    divDisplay.style.top = "50%";
                    d.body.appendChild(divDisplay);
                    this.divDisplay = divDisplay;
                }
                var display = universe.display;
                divDisplay.style.marginLeft = "" + (0 - display.sizeInPixels.x / 2);
                divDisplay.style.marginTop = "" + (0 - display.sizeInPixels.y / 2);
            }
        }
        GameFramework.PlatformHelper = PlatformHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
