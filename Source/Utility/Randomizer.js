"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Randomizer {
            // Abstract methods.
            fraction() { throw new Error("Method must be overridden."); }
            integerLessThan(max) { throw new Error("Method must be overridden."); }
            // Other methods.
            chooseNElementsFromArray(numberToChoose, arrayToChooseFrom) {
                var elementsChosen = new Array();
                var elementsRemaining = arrayToChooseFrom.map(x => x);
                for (var i = 0; i < numberToChoose; i++) {
                    var elementIndexRandom = this.integerLessThan(elementsRemaining.length);
                    var elementChosen = elementsRemaining[elementIndexRandom];
                    elementsChosen.push(elementChosen);
                    elementsRemaining.splice(elementsRemaining.indexOf(elementChosen), 1);
                }
                return elementsChosen;
            }
            chooseRandomElementFromArray(arrayToChooseFrom) {
                var randomIndex = this.integerLessThan(arrayToChooseFrom.length);
                var randomElement = arrayToChooseFrom[randomIndex];
                return randomElement;
            }
        }
        GameFramework.Randomizer = Randomizer;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
