"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TalkNode //
         {
            constructor(name, defnName, content, next, isEnabled) {
                this.name = name;
                if (defnName == GameFramework.TalkNodeDefn.Instances().Option.name) {
                    // todo
                    // Doing this for nodes with types other than "Option"
                    // causes mysterious errors.
                    if (this.name == null || this.name == "") {
                        this.name = content;
                    }
                }
                if (this.name == null || this.name == "") {
                    this.name = TalkNode.idNext();
                }
                this.defnName = defnName;
                this.content = content == "" ? null : content;
                this.next = next == "" ? null : next;
                this._isEnabled = isEnabled;
            }
            static fromDefn(defn) {
                return new TalkNode(null, defn.name, null, null, null);
            }
            static fromDefnAndContent(defn, content) {
                return new TalkNode(null, defn.name, content, null, null);
            }
            static fromDefnContentAndNext(defn, content, next) {
                return new TalkNode(null, defn.name, content, next, null);
            }
            static fromNameAndDefn(name, defn) {
                return new TalkNode(name, defn.name, null, null, null);
            }
            static fromNameDefnAndContent(name, defn, content) {
                return new TalkNode(name, defn.name, content, null, null);
            }
            static fromNameDefnContentAndNext(name, defn, content, next) {
                return new TalkNode(name, defn.name, content, next, null);
            }
            static fromNameDefnNameContentNextAndEnabled(name, defnName, content, next, isEnabled) {
                return new TalkNode(name, defnName, content, next, isEnabled);
            }
            static idNext() {
                var returnValue = "_" + TalkNode._idNext;
                TalkNode._idNext++;
                return returnValue;
            }
            // Types.
            static display(name, content) {
                return TalkNode.fromNameDefnAndContent(name, GameFramework.TalkNodeDefn.Instances().Display, content);
            }
            static doNothing(name) {
                return TalkNode.fromNameAndDefn(name, GameFramework.TalkNodeDefn.Instances().DoNothing);
            }
            static option(name, content, next) {
                return TalkNode.fromNameDefnContentAndNext(name, GameFramework.TalkNodeDefn.Instances().Option, content, next);
            }
            static goto(next) {
                return TalkNode.fromDefnContentAndNext(GameFramework.TalkNodeDefn.Instances().Goto, null, // content
                next);
            }
            static pop() {
                return TalkNode.fromDefn(GameFramework.TalkNodeDefn.Instances().Pop);
            }
            static prompt() {
                return TalkNode.fromDefn(GameFramework.TalkNodeDefn.Instances().Prompt);
            }
            static push(next) {
                return TalkNode.fromDefnContentAndNext(GameFramework.TalkNodeDefn.Instances().Push, null, // content
                next);
            }
            static quit() {
                return TalkNode.fromDefn(GameFramework.TalkNodeDefn.Instances().Quit);
            }
            static scriptFromName(name) {
                return TalkNode.fromDefnAndContent(GameFramework.TalkNodeDefn.Instances().ScriptFromName, name);
            }
            static scriptUsingEval(code) {
                return TalkNode.fromDefnAndContent(GameFramework.TalkNodeDefn.Instances().ScriptUsingEval, code);
            }
            static scriptUsingFunctionConstructor(code) {
                return TalkNode.fromDefnAndContent(GameFramework.TalkNodeDefn.Instances().ScriptUsingFunctionConstructor, code);
            }
            static _switch // "switch" is a keyword.
            (variableName, variableValueNodeNextNamePairs) {
                var next = variableValueNodeNextNamePairs.map(pair => pair.join(":")).join(";");
                return TalkNode.fromDefnContentAndNext(GameFramework.TalkNodeDefn.Instances().Switch, variableName, // content
                next);
            }
            static variableLoad(name, variableName, variableExpression) {
                return TalkNode.fromNameDefnContentAndNext(name, GameFramework.TalkNodeDefn.Instances().VariableLoad, variableName, // content
                variableExpression);
            }
            static variableSet(variableName, variableValueToSet) {
                return TalkNode.fromDefnContentAndNext(GameFramework.TalkNodeDefn.Instances().VariableSet, variableName, variableValueToSet);
            }
            static variableStore(name, variableName, variableExpression) {
                return TalkNode.fromNameDefnContentAndNext(name, GameFramework.TalkNodeDefn.Instances().VariableStore, variableName, variableExpression);
            }
            // instance methods
            contentVariablesSubstitute(conversationRun) {
                var content = this.content;
                if (content.indexOf("^") > 0) {
                    var contentParts = content.split("^");
                    for (var i = 1; i < contentParts.length; i += 2) {
                        var variableName = contentParts[i];
                        var variableValue = conversationRun.variableByName(variableName);
                        contentParts[i] = variableValue.toString();
                    }
                    this.content = contentParts.join("");
                }
            }
            defn(conversationDefn) {
                return conversationDefn.talkNodeDefnsByName.get(this.defnName);
            }
            disable() {
                this._isEnabled = GameFramework.Script.Instances().ReturnFalse;
                return this;
            }
            enable() {
                this._isEnabled = GameFramework.Script.Instances().ReturnTrue;
                return this;
            }
            execute(universe, conversationRun, scope) {
                var defn = this.defn(conversationRun.defn);
                defn.execute(universe, conversationRun);
            }
            isDisabled(u, cr) {
                return (this.isEnabled(u, cr) == false);
            }
            isEnabled(u, cr) {
                return this.isEnabledForUniverseAndConversationRun(u, cr);
            }
            isEnabledForUniverseAndConversationRun(u, cr) {
                var returnValue = (this._isEnabled == null
                    ? true
                    : this._isEnabled.runWithParams2(u, cr));
                return returnValue;
            }
            textForTranscript(conversationRun) {
                var speakerName = (this.defnName == "Option"
                    ? conversationRun.entityPlayer.name
                    : conversationRun.entityTalker.name);
                var returnValue = speakerName + ": " + this.content;
                return returnValue;
            }
            // Clonable.
            clone() {
                return new TalkNode(this.name, this.defnName, this.content, this.next, this._isEnabled);
            }
            overwriteWith(other) {
                this.name = other.name;
                this.defnName = other.defnName;
                this.content = other.content;
                this.next = other.next;
                this._isEnabled = other._isEnabled;
                return this;
            }
            // Serialization.
            static fromLinePipeSeparatedValues(talkNodeAsLinePsv) {
                var fields = talkNodeAsLinePsv.split("|");
                var isEnabledAsText = fields[4];
                var isEnabled;
                if (isEnabledAsText == null) {
                    isEnabled = null;
                }
                else {
                    var scriptToRunAsString = "( (u, cr) => " + isEnabledAsText + " )";
                    try {
                        isEnabled = GameFramework.ScriptUsingFunctionConstructor.fromCodeAsString(scriptToRunAsString);
                    }
                    catch (err) {
                        throw err;
                    }
                }
                var name = fields[0];
                var defnName = fields[1];
                var content = fields[2];
                var next = fields[3];
                var returnValue = TalkNode.fromNameDefnNameContentNextAndEnabled(name, defnName, content, next, isEnabled);
                return returnValue;
            }
            toPipeSeparatedValues() {
                var returnValue = [
                    this.name,
                    this.defnName,
                    this.content,
                    this.next,
                    this._isEnabled == null ? null : this._isEnabled.toString()
                ].join("|");
                while (returnValue.endsWith("|")) {
                    returnValue = returnValue.substr(0, returnValue.length - 1);
                }
                return returnValue;
            }
            // String.
            toString() {
                return this.content;
            }
            toStringPipeSeparatedValues() {
                return this.name + "|" + this.defnName + "|" + this.content + "|" + (this.next || "");
            }
        }
        // static methods
        TalkNode._idNext = 0;
        GameFramework.TalkNode = TalkNode;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
