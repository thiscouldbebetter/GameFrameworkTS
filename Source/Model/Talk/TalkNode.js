"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TalkNode {
            constructor(name, defnName, content, next, isDisabled) {
                this.name = (name == null ? TalkNode.idNext() : name);
                this.defnName = defnName;
                this.content = content;
                this.next = next;
                this._isDisabled = isDisabled;
            }
            static idNext() {
                var returnValue = "_" + TalkNode._idNext;
                TalkNode._idNext++;
                return returnValue;
            }
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
            activate(conversationRun, scope) {
                var defn = this.defn(conversationRun.defn);
                if (defn.activate != null) {
                    defn.activate(conversationRun, scope, this);
                }
            }
            defn(conversationDefn) {
                return conversationDefn.talkNodeDefnsByName.get(this.defnName);
            }
            disable() {
                this._isDisabled = () => true;
                return this;
            }
            execute(universe, conversationRun, scope) {
                var defn = this.defn(conversationRun.defn);
                defn.execute(universe, conversationRun, scope, this);
            }
            isEnabled(u, cr) {
                return (this._isDisabled == null ? true : this._isDisabled(u, cr) == false);
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
        }
        // static methods
        TalkNode._idNext = 0;
        GameFramework.TalkNode = TalkNode;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
