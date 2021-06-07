"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TextString {
            constructor(name, sourcePath) {
                this.name = name;
                this.sourcePath = sourcePath;
                this.load();
            }
            // static methods
            static fromString(name, value) {
                var returnValue = new TextString(name, null // sourcePath
                );
                returnValue.value = value;
                return returnValue;
            }
            // instance methods
            load() {
                var text = this;
                var xmlHttpRequest = new XMLHttpRequest();
                xmlHttpRequest.open("GET", this.sourcePath);
                xmlHttpRequest.onreadystatechange = () => {
                    text.value = xmlHttpRequest.responseText;
                    text.isLoaded = true;
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
        GameFramework.TextString = TextString;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
