"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class CharacterSet {
            constructor(name, charactersAsString) {
                this.name = name;
                this.charactersAsString = charactersAsString;
            }
            static Instances() {
                if (this._instances == null) {
                    this._instances = new CharacterSet_Instances();
                }
                return this._instances;
            }
            static byName(name) {
                return this.Instances().byName(name);
            }
            characterAtIndex(charIndex) {
                return this.charactersAsString[charIndex];
            }
            characterCount() {
                return this.charactersAsString.length;
            }
            characterFirst() {
                return this.charactersAsString[0];
            }
            characterLast() {
                return this.charactersAsString[this.charactersAsString.length - 1];
            }
            containsCharacter(characterToCheck) {
                return this.charactersAsString.indexOf(characterToCheck) >= 0;
            }
            indexOfCharacter(characterToFindIndexOf) {
                return this.charactersAsString.indexOf(characterToFindIndexOf);
            }
        }
        GameFramework.CharacterSet = CharacterSet;
        class CharacterSet_Instances {
            constructor() {
                var cs = (name, chars) => new CharacterSet(name, chars);
                var lettersUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                var lettersLowercase = "abcdefghijklmnopqrstuvwxyz";
                var letters = lettersUppercase + lettersLowercase;
                var space = " ";
                var numerals = "0123456789";
                var punctuation = ".,;:-/'\"()[]{}|\_+=?!@#$%^&*";
                this.LettersSpaceNumeralsPunctuation = cs("LettersSpaceNumeralsPunctuation", letters + space + numerals + punctuation);
                this.LettersUppercase = cs("LettersUppercase", lettersUppercase);
                this._All =
                    [
                        this.LettersSpaceNumeralsPunctuation,
                        this.LettersUppercase
                    ];
            }
            byName(name) {
                return this._All.find(x => x.name == name);
            }
        }
        GameFramework.CharacterSet_Instances = CharacterSet_Instances;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
