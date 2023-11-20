"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TextStringFromImage {
            constructor(name, sourcePath) {
                this.name = name;
                this.sourcePath = sourcePath;
                //this.load(null, null);
            }
            // static methods
            static fromString(name, value) {
                var returnValue = new GameFramework.TextString(name, null // sourcePath
                );
                returnValue.value = value;
                return returnValue;
            }
            load(uwpe, callback) {
                var textAsImage = new GameFramework.Image2(this.name, this.sourcePath);
                textAsImage.load((imageLoaded) => {
                    var transcoder = ThisCouldBeBetter.BinaryFileToImageTranscoder.BinaryFileToImageTranscoder.Instance();
                    var imageAsBytes = transcoder.imgElementToBytes(imageLoaded.systemImage);
                    var imageAsChars = imageAsBytes.map((x) => String.fromCharCode(x));
                    var imageAsString = imageAsChars.join("");
                    this.value = imageAsString;
                });
            }
            unload(uwpe) { }
        }
        GameFramework.TextStringFromImage = TextStringFromImage;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
