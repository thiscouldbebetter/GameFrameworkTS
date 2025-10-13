"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Script {
            constructor(name) {
                this.name = name;
            }
            static Instances() {
                if (this._instances == null) {
                    this._instances = new Script_Instances();
                }
                return this._instances;
            }
            static byName(name) {
                return this.Instances().byName(name);
            }
            runWithParams0() {
                throw new Error("Must be implemented in subclass!");
            }
            runWithParams1(param0) {
                throw new Error("Must be implemented in subclass!");
            }
            runWithParams2(param0, param1) {
                throw new Error("Must be implemented in subclass!");
            }
        }
        GameFramework.Script = Script;
        class Script_Instances {
            constructor() {
                var sfrn = (n, r) => new ScriptFromRunFunction(n, r);
                this._DoNothing = sfrn("DoNothing", () => { });
                this.ReturnFalse = sfrn("ReturnFalse", () => false);
                this.ReturnTrue = sfrn("ReturnTrue", () => true);
                this._All =
                    [
                        this._DoNothing,
                        this.ReturnFalse,
                        this.ReturnTrue
                    ];
            }
            byName(name) {
                return this._All.find(x => x.name == name);
            }
        }
        GameFramework.Script_Instances = Script_Instances;
        class ScriptFromRunFunction extends Script {
            constructor(name, run) {
                super(name);
                this._run = run;
            }
            runWithParams0() {
                return this._run(null, null);
            }
            runWithParams1(param0) {
                return this._run(param0, null);
            }
            runWithParams2(param0, param1) {
                return this._run(param0, param1);
            }
        }
        GameFramework.ScriptFromRunFunction = ScriptFromRunFunction;
        class ScriptUsingEval extends Script {
            constructor(name, codeAsString) {
                super(name);
                this.codeAsString = codeAsString;
            }
            static fromCodeAsString(codeAsString) {
                return new ScriptUsingEval(null, codeAsString);
            }
            static fromFunction(codeAsFunction) {
                var script = new ScriptUsingEval(null, null);
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
        GameFramework.ScriptUsingEval = ScriptUsingEval;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
