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
                var returnValue = codeParsed.call(this, uwpe);
                return returnValue;
            }
            runWithParams1(param0) {
                var codeParsed = this.codeAsFunction();
                var returnValue = codeParsed.call(this, param0);
                return returnValue;
            }
            runWithParams2(param0, param1) {
                var codeParsed = this.codeAsFunction();
                var returnValue = codeParsed.call(this, param0, param1);
                return returnValue;
            }
        }
        GameFramework.Script = Script;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
