"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class StringHelper {
            // Static class.
            static lowercaseFirstCharacter(value) {
                return value.substr(0, 1).toLowerCase() + value.substr(1);
            }
            static padEnd(stringToPad, lengthToPadTo, charToPadWith) {
                while (stringToPad.length < lengthToPadTo) {
                    stringToPad = stringToPad + charToPadWith;
                }
                return stringToPad;
            }
            static padStart(stringToPad, lengthToPadTo, charToPadWith) {
                while (stringToPad.length < lengthToPadTo) {
                    stringToPad = charToPadWith + stringToPad;
                }
                return stringToPad;
            }
            static spacesToUnderscores(stringToAlter) {
                return StringHelper.replaceAll(stringToAlter, " ", "_");
            }
            static replaceAll(stringToReplaceWithin, stringToBeReplaced, stringToReplaceWith) {
                return stringToReplaceWithin.split(stringToBeReplaced).join(stringToReplaceWith);
            }
            static toTitleCase(value) {
                return value.substr(0, 1).toUpperCase() + value.substr(1).toLowerCase();
            }
        }
        GameFramework.StringHelper = StringHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
