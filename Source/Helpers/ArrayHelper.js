"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ArrayHelper {
            static add(array, element) {
                array.push(element);
                return array;
            }
            static addMany(array, elements) {
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    array.push(element);
                }
                return array;
            }
            static addLookups(array, getKeyForElement) {
                var returnLookup = new Map();
                for (var i = 0; i < array.length; i++) {
                    var element = array[i];
                    var key = getKeyForElement(element);
                    returnLookup.set(key, element);
                }
                return returnLookup;
            }
            static addLookupsByName(array) {
                return ArrayHelper.addLookups(array, (element) => element.name);
            }
            static addLookupsMultiple(array, getKeysForElement) {
                var returnLookup = new Map();
                for (var i = 0; i < array.length; i++) {
                    var element = array[i];
                    var keys = getKeysForElement(element);
                    for (var k = 0; k < keys.length; k++) {
                        var key = keys[k];
                        returnLookup.set(key, element);
                    }
                }
                return returnLookup;
            }
            static append(array, other) {
                for (var i = 0; i < other.length; i++) {
                    var element = other[i];
                    array.push(element);
                }
                return array;
            }
            static areEqual(array0, array1) {
                var areArraysEqual = true;
                if (array0.length != array1.length) {
                    areArraysEqual = false;
                }
                else {
                    for (var i = 0; i < array0.length; i++) {
                        var element0 = array0[i];
                        var element1 = array1[i];
                        if (element0 == element1) {
                            // Do nothing.
                        }
                        else if (element0.equals != null
                            && element1.equals != null
                            && element0.equals(element1)) {
                            // Do nothing.
                        }
                        else {
                            var element0AsJson = JSON.stringify(element0);
                            var element1AsJson = JSON.stringify(element1);
                            if (element0AsJson != element1AsJson) {
                                areArraysEqual = false;
                                break;
                            }
                        }
                    }
                }
                return areArraysEqual;
            }
            static clear(array) {
                array.length = 0;
                return array;
            }
            static clone(array) {
                var returnValue = null;
                if (array != null) {
                    returnValue = [];
                    for (var i = 0; i < array.length; i++) {
                        var element = array[i];
                        var elementCloned = element.clone();
                        returnValue.push(elementCloned);
                    }
                }
                return returnValue;
            }
            static flattenArrayOfArrays(arrayOfArrays) {
                var arrayFlattened = [];
                for (var i = 0; i < arrayOfArrays.length; i++) {
                    var childArray = arrayOfArrays[i];
                    arrayFlattened =
                        arrayFlattened.concat(childArray);
                }
                return arrayFlattened;
            }
            static contains(array, elementToFind) {
                return (array.indexOf(elementToFind) >= 0);
            }
            static equals(array, other) {
                var areEqualSoFar;
                if (array.length != other.length) {
                    areEqualSoFar = false;
                }
                else {
                    for (var i = 0; i < array.length; i++) {
                        areEqualSoFar = array[i].equals(other[i]);
                        if (areEqualSoFar == false) {
                            break;
                        }
                    }
                }
                return areEqualSoFar;
            }
            static insertElementAfterOther(array, elementToInsert, other) {
                var index = array.indexOf(other);
                if (index >= 0) {
                    array.splice(index + 1, 0, elementToInsert);
                }
                else {
                    array.push(elementToInsert);
                }
                return array;
            }
            static insertElementAt(array, element, index) {
                array.splice(index, 0, element);
                return array;
            }
            static intersectArrays(array0, array1) {
                var elementsInBothArrays = new Array();
                for (var i = 0; i < array0.length; i++) {
                    var element = array0[i];
                    var isElementInArray1 = (array1.indexOf(element) >= 0);
                    if (isElementInArray1) {
                        elementsInBothArrays.push(element);
                    }
                }
                return elementsInBothArrays;
            }
            static overwriteWith(array, other) {
                for (var i = 0; i < array.length; i++) {
                    var elementThis = array[i];
                    var elementOther = other[i];
                    if (elementThis.overwriteWith == null) {
                        array[i] = elementOther;
                    }
                    else {
                        elementThis.overwriteWith(elementOther);
                    }
                }
                return array;
            }
            static prepend(array, other) {
                for (var i = 0; i < other.length; i++) {
                    var element = other[i];
                    array.splice(0, 0, element);
                }
                return array;
            }
            static random(array, randomizer) {
                return array[Math.floor(randomizer.getNextRandom() * array.length)];
            }
            static remove(array, elementToRemove) {
                var indexToRemoveAt = array.indexOf(elementToRemove);
                if (indexToRemoveAt >= 0) {
                    array.splice(indexToRemoveAt, 1);
                }
                return array;
            }
            static removeAt(array, index) {
                array.splice(index, 1);
                return array;
            }
        }
        GameFramework.ArrayHelper = ArrayHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
