"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Script {
            constructor(name, codeAsString) {
                this.name = name;
                this.codeAsString = codeAsString;
            }
            static fromCodeAsString(codeAsString) {
                return new Script(null, codeAsString);
            }
            static fromFunction(codeAsFunction) {
                var script = new Script(null, null);
                script._codeAsFunction = codeAsFunction;
                return script;
            }
            codeAsFunction() {
                if (this._codeAsFunction == null) {
                    this._codeAsFunction = eval(this.codeAsString);
                    // It'd be nice to catch errors here,
                    // but because of how eval() works,
                    // it's seemingly not possible.
                }
                return this._codeAsFunction;
            }
            run(uwpe) {
                var codeParsed = this.codeAsFunction();
                var returnValue = codeParsed.run(this, uwpe);
                return returnValue;
            }
        }
        GameFramework.Script = Script;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
