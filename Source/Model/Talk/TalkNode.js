"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TalkNode //
         {
            constructor(name, defnName, content, next, isDisabled) {
                this.name = ((name == null || name == "") ? TalkNode.idNext() : name);
                this.defnName = defnName;
                this.content = content == "" ? null : content;
                this.next = next == "" ? null : next;
                this._isDisabled = isDisabled;
            }
            static fromLinePipeSeparatedValues(talkNodeAsLinePsv) {
                var fields = talkNodeAsLinePsv.split("|");
                var isDisabledAsText = fields[4];
                var isDisabled;
                if (isDisabledAsText == null) {
                    isDisabled = null;
                }
                else {
                    var scriptToRunAsString = "( (u, cr) => " + isDisabledAsText + " )";
                    isDisabled = eval(scriptToRunAsString);
                }
                var returnValue = new TalkNode(fields[0], // name
                fields[1], // defnName
                fields[2], // content
                fields[3], // next
                isDisabled);
                return returnValue;
            }
            static idNext() {
                var returnValue = "_" + TalkNode._idNext;
                TalkNode._idNext++;
                return returnValue;
            }
            // Types.
            static display(name, content) {
                return new TalkNode(name, GameFramework.TalkNodeDefn.Instances().Display.name, content, null, // next
                null // isDisabled
                );
            }
            static doNothing(name) {
                return new TalkNode(name, GameFramework.TalkNodeDefn.Instances().DoNothing.name, null, // content
                null, // next
                null // isDisabled
                );
            }
            static option(name, content, next) {
                return new TalkNode(name, GameFramework.TalkNodeDefn.Instances().Option.name, content, next, null // isDisabled
                );
            }
            static goto(next) {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Goto.name, null, // content
                next, null // isDisabled
                );
            }
            static pop() {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Pop.name, null, // content
                null, // next
                null // isDisabled
                );
            }
            static prompt() {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Prompt.name, null, // content
                null, // next
                null // isDisabled
                );
            }
            static push(next) {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Push.name, null, // content
                next, null // isDisabled
                );
            }
            static quit() {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Quit.name, null, // content
                null, // next
                null // isDisabled
                );
            }
            static script(code) {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Script.name, code, null, // next
                null // isDisabled
                );
            }
            static _switch // "switch" is a keyword.
            (variableName, variableValueNodeNextNamePairs) {
                var next = variableValueNodeNextNamePairs.map(pair => pair.join(":")).join(";");
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Switch.name, variableName, // content
                next, null // isDisabled
                );
            }
            static variableLoad(name, variableName, variableExpression) {
                return new TalkNode(name, GameFramework.TalkNodeDefn.Instances().VariableLoad.name, variableName, // content
                variableExpression, // next
                null // isDisabled
                );
            }
            static variableSet(variableName, variableValueToSet) {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().VariableSet.name, variableName, // content
                variableValueToSet, // next
                null // isDisabled
                );
            }
            static variableStore(name, variableName, variableExpression) {
                return new TalkNode(name, GameFramework.TalkNodeDefn.Instances().VariableStore.name, variableName, // content
                variableExpression, // next
                null // isDisabled
                );
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
                this._isDisabled = () => true;
                return this;
            }
            enable() {
                this._isDisabled = () => false;
                return this;
            }
            execute(universe, conversationRun, scope) {
                var defn = this.defn(conversationRun.defn);
                defn.execute(universe, conversationRun);
            }
            isEnabled(u, cr) {
                return this.isEnabledForUniverseAndConversationRun(u, cr);
            }
            isEnabledForUniverseAndConversationRun(u, cr) {
                var returnValue = (this._isDisabled == null
                    ? true
                    : this._isDisabled(u, cr) == false);
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
                return new TalkNode(this.name, this.defnName, this.content, this.next, this._isDisabled);
            }
            overwriteWith(other) {
                this.name = other.name;
                this.defnName = other.defnName;
                this.content = other.content;
                this.next = other.next;
                this._isDisabled = other._isDisabled;
                return this;
            }
            // String.
            toString() {
                return this.content;
            }
        }
        // static methods
        TalkNode._idNext = 0;
        GameFramework.TalkNode = TalkNode;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
