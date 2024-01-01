"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TextString {
            constructor(name, sourcePath) {
                this.name = name;
                this.sourcePath = sourcePath;
                //this.load(null, null);
            }
            // static methods
            static fromString(name, value) {
                var returnValue = new TextString(name, null // sourcePath
                );
                returnValue.value = value;
                returnValue.isLoaded = true;
                return returnValue;
            }
            load(uwpe, callback) {
                if (this.isLoaded) {
                    if (callback != null) {
                        callback(this);
                    }
                }
                else {
                    var text = this;
                    var xmlHttpRequest = new XMLHttpRequest();
                    xmlHttpRequest.open("GET", this.sourcePath);
                    xmlHttpRequest.responseType = "text"; // Default?
                    xmlHttpRequest.onloadend = () => {
                        text.value = xmlHttpRequest.responseText;
                        text.isLoaded = true;
                        if (callback != null) {
                            callback(text);
                        }
                    };
                    xmlHttpRequest.send();
                    /*
                    fetch(this.sourcePath).then
                    (
                        response => response.json()
                    ).then
                    (
                        data =>
                        {
                            text.value = data;
                            text.isLoaded = true;
                        }
                    );
                    */
                }
            }
            unload(uwpe) { }
        }
        GameFramework.TextString = TextString;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
