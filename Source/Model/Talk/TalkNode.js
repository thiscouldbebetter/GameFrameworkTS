"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TalkNode //
         {
            constructor(name, defnName, content, next, isEnabled) {
                this.name = ((name == null || name == "") ? TalkNode.idNext() : name);
                this.defnName = defnName;
                this.content = content == "" ? null : content;
                this.next = next == "" ? null : next;
                this._isEnabled = isEnabled;
            }
            static fromDefnName(defnName) {
                return new TalkNode(null, defnName, null, null, null);
            }
            static idNext() {
                var returnValue = "_" + TalkNode._idNext;
                TalkNode._idNext++;
                return returnValue;
            }
            // Types.
            static display(name, content) {
                return new TalkNode(name, GameFramework.TalkNodeDefn.Instances().Display.name, content, null, // next
                null // isEnabled
                );
            }
            static doNothing(name) {
                return new TalkNode(name, GameFramework.TalkNodeDefn.Instances().DoNothing.name, null, // content
                null, // next
                null // isEnabled
                );
            }
            static option(name, content, next) {
                return new TalkNode(name, GameFramework.TalkNodeDefn.Instances().Option.name, content, next, null // isEnabled
                );
            }
            static goto(next) {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Goto.name, null, // content
                next, null // isEnabled
                );
            }
            static pop() {
                return TalkNode.fromDefnName(GameFramework.TalkNodeDefn.Instances().Pop.name);
            }
            static prompt() {
                return TalkNode.fromDefnName(GameFramework.TalkNodeDefn.Instances().Prompt.name);
            }
            static push(next) {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Push.name, null, // content
                next, null // isEnabled
                );
            }
            static quit() {
                return TalkNode.fromDefnName(GameFramework.TalkNodeDefn.Instances().Quit.name);
            }
            static script(code) {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Script.name, code, null, // next
                null // isEnabled
                );
            }
            static _switch // "switch" is a keyword.
            (variableName, variableValueNodeNextNamePairs) {
                var next = variableValueNodeNextNamePairs.map(pair => pair.join(":")).join(";");
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Switch.name, variableName, // content
                next, null // isEnabled
                );
            }
            static variableLoad(name, variableName, variableExpression) {
                return new TalkNode(name, GameFramework.TalkNodeDefn.Instances().VariableLoad.name, variableName, // content
                variableExpression, // next
                null // isEnabled
                );
            }
            static variableSet(variableName, variableValueToSet) {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().VariableSet.name, variableName, // content
                variableValueToSet, // next
                null // isEnabled
                );
            }
            static variableStore(name, variableName, variableExpression) {
                return new TalkNode(name, GameFramework.TalkNodeDefn.Instances().VariableStore.name, variableName, // content
                variableExpression, // next
                null // isEnabled
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
                this._isEnabled = () => false;
                return this;
            }
            enable() {
                this._isEnabled = () => true;
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
                    : this._isEnabled(u, cr));
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
                    isEnabled = eval(scriptToRunAsString);
                }
                var returnValue = new TalkNode(fields[0], // name
                fields[1], // defnName
                fields[2], // content
                fields[3], // next
                isEnabled);
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
        }
        // static methods
        TalkNode._idNext = 0;
        GameFramework.TalkNode = TalkNode;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
