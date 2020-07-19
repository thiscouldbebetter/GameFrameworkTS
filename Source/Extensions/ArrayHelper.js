"use strict";
class ArrayHelper {
    static add(array, element) {
        array.push(element);
        return array;
    }
    ;
    static addMany(array, elements) {
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            array.push(element);
        }
        return array;
    }
    ;
    static addLookups(array, getKeyForElement) {
        var returnLookup = new Map();
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            var key = getKeyForElement(element);
            returnLookup.set(key, element);
        }
        return returnLookup;
    }
    ;
    static addLookupsByName(array) {
        return ArrayHelper.addLookups(array, (element) => element.name);
    }
    ;
    static addLookupsMultiple(array, getKeysForElement) {
        var returnLookup = {};
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            var keys = getKeysForElement(element);
            for (var k = 0; k < keys.length; k++) {
                var key = keys[k];
                returnLookup[key] = element;
            }
        }
        return returnLookup;
    }
    ;
    static append(array, other) {
        for (var i = 0; i < other.length; i++) {
            var element = other[i];
            array.push(element);
        }
        return array;
    }
    ;
    static clear(array) {
        array.length = 0;
        return array;
    }
    ;
    static clone(array) {
        var returnValue = [];
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            var elementCloned = element.clone();
            returnValue.push(elementCloned);
        }
        return returnValue;
    }
    ;
    static concatenateAll(arrays) {
        var childrenConcatenated = [];
        for (var i = 0; i < arrays.length; i++) {
            var childArray = arrays[i];
            childrenConcatenated = childrenConcatenated.concat(childArray);
        }
        return childrenConcatenated;
    }
    ;
    static contains(array, elementToFind) {
        return (array.indexOf(elementToFind) >= 0);
    }
    ;
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
    ;
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
    ;
    static insertElementAt(array, element, index) {
        array.splice(index, 0, element);
        return array;
    }
    ;
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
    ;
    static prepend(array, other) {
        for (var i = 0; i < other.length; i++) {
            var element = other[i];
            array.splice(0, 0, element);
        }
        return array;
    }
    ;
    static random(array, randomizer) {
        return array[Math.floor(randomizer.getNextRandom() * array.length)];
    }
    ;
    static remove(array, elementToRemove) {
        var indexToRemoveAt = array.indexOf(elementToRemove);
        if (indexToRemoveAt >= 0) {
            array.splice(indexToRemoveAt, 1);
        }
        return array;
    }
    ;
    static removeAt(array, index) {
        array.splice(index, 1);
        return array;
    }
    ;
}
