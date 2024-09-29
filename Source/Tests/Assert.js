"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Assert {
            static areEqual(objectExpected, objectActual) {
                var areExpectedAndActualEqual = this.areObjectsEqual(objectExpected, objectActual);
                if (areExpectedAndActualEqual == false) {
                    var errorMessage = "Expected: " + JSON.stringify(objectExpected)
                        + ", but was: " + JSON.stringify(objectActual) + ".";
                    throw new Error(errorMessage);
                }
            }
            static areNotEqual(objectExpected, objectActual) {
                var areExpectedAndActualEqual = this.areObjectsEqual(objectExpected, objectActual);
                if (areExpectedAndActualEqual) {
                    var errorMessage = "The objects were equal, which was not expected.";
                    throw (errorMessage);
                }
            }
            static areNumbersEqual(numberExpected, numberActual) {
                if (numberActual != numberExpected) {
                    var errorMessage = "Expected: " + numberExpected
                        + ", but was: " + numberActual + ".";
                    throw new Error(errorMessage);
                }
            }
            static areStringsEqual(stringExpected, stringActual) {
                if (stringActual != stringExpected) {
                    var errorMessage = "Expected: " + stringExpected
                        + ", but was: " + stringActual + ".";
                    throw new Error(errorMessage);
                }
            }
            static isEmpty(arrayToCheck) {
                if (arrayToCheck.length != 0) {
                    throw new Error("Expected: empty, but was: not empty.");
                }
            }
            static isFalse(valueToTest) {
                if (valueToTest != false) {
                    throw new Error("Expected: false, but was: " + valueToTest + ".");
                }
            }
            static isNotEmpty(arrayToCheck) {
                if (arrayToCheck.length == 0) {
                    throw new Error("Expected: not empty, but was: empty.");
                }
            }
            static isNotNull(valueToTest) {
                if (valueToTest == null) {
                    throw new Error("Expected: not null, but was: null.");
                }
            }
            static isNull(valueToTest) {
                if (valueToTest != null) {
                    throw new Error("Expected: null, but was: not null.");
                }
            }
            static isTrue(valueToTest) {
                if (valueToTest != true) {
                    throw new Error("Expected: true, but was: " + valueToTest + ".");
                }
            }
            static throwsError(functionToTest) {
                try {
                    functionToTest();
                    throw new Error("Expected an error to be thrown, but none was.");
                }
                catch (ex) {
                    // Do nothing.
                }
            }
            // Helper methods.
            static areObjectsEqual(objectExpected, objectActual) {
                var areExpectedAndActualEqual;
                if (objectExpected == objectActual) {
                    areExpectedAndActualEqual = true;
                }
                else if (objectExpected.equals(objectActual)) {
                    areExpectedAndActualEqual = true;
                }
                else {
                    var objectExpectedAsJson = JSON.stringify(objectExpected);
                    var objectActualAsJson = JSON.stringify(objectActual);
                    areExpectedAndActualEqual =
                        (objectExpectedAsJson == objectActualAsJson);
                }
                return areExpectedAndActualEqual;
            }
        }
        GameFramework.Assert = Assert;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
