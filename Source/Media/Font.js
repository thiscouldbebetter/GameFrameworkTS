"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Font {
            constructor(name, sourcePath) {
                this.name = name;
                this.sourcePath = sourcePath;
                this.isLoaded = false;
                //this.load();
            }
            id() {
                return Font.name + this.name;
            }
            load(uwpe, callback) {
                if (this.isLoaded == false) {
                    var fontAsStyleElement = document.createElement("style");
                    fontAsStyleElement.id = this.id();
                    fontAsStyleElement.innerHTML =
                        "@font-face { "
                            + "font-family: '" + this.name + "';"
                            + "src: url('" + this.sourcePath + "');";
                    +"}";
                    document.head.appendChild(fontAsStyleElement);
                    this.isLoaded = true;
                }
                return this;
            }
            unload(uwpe) {
                throw new Error("todo");
            }
        }
        GameFramework.Font = Font;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
