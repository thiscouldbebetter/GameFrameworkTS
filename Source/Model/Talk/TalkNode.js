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
                this.isDisabled = (isDisabled == null ? false : isDisabled);
            }
            static idNext() {
                var returnValue = "_" + TalkNode._idNext;
                TalkNode._idNext++;
                return returnValue;
            }
            static display(name, content) {
                return new TalkNode(name, GameFramework.TalkNodeDefn.Instances().Display.name, content, null, // next
                false // isDisabled
                );
            }
            static doNothing(name) {
                return new TalkNode(name, GameFramework.TalkNodeDefn.Instances().DoNothing.name, null, // content
                null, // next
                false // isDisabled
                );
            }
            static option(name, content, next) {
                return new TalkNode(name, GameFramework.TalkNodeDefn.Instances().Option.name, content, next, false // isDisabled
                );
            }
            static goto(next) {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Goto.name, null, // content
                next, false // isDisabled
                );
            }
            static pop() {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Pop.name, null, // content
                null, // next
                false // isDisabled
                );
            }
            static prompt() {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Prompt.name, null, // content
                null, // next
                false // isDisabled
                );
            }
            static push(next) {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Push.name, null, // content
                next, false // isDisabled
                );
            }
            static quit() {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Quit.name, null, // content
                null, // next
                false // isDisabled
                );
            }
            static script(code) {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Script.name, code, null, // next
                false // isDisabled
                );
            }
            static _switch // "switch" is a keyword.
            (variableName, variableValueNodeNextNamePairs) {
                var next = variableValueNodeNextNamePairs.map(pair => pair.join(":")).join(";");
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().Switch.name, variableName, // content
                next, false // isDisabled
                );
            }
            static variableLoad(name, variableName, variableExpression) {
                return new TalkNode(name, GameFramework.TalkNodeDefn.Instances().VariableLoad.name, variableName, // content
                variableExpression, // next
                false // isDisabled
                );
            }
            static variableSet(variableName, variableValueToSet) {
                return new TalkNode(null, // name,
                GameFramework.TalkNodeDefn.Instances().VariableSet.name, variableName, // content
                variableValueToSet, // next
                false // isDisabled
                );
            }
            static variableStore(name, variableName, variableExpression) {
                return new TalkNode(name, GameFramework.TalkNodeDefn.Instances().VariableStore.name, variableName, // content
                variableExpression, // next
                false // isDisabled
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
                this.isDisabled = true;
                return this;
            }
            execute(universe, conversationRun, scope) {
                var defn = this.defn(conversationRun.defn);
                defn.execute(universe, conversationRun, scope, this);
            }
            isEnabled() {
                return (this.isDisabled == false);
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
                return new TalkNode(this.name, this.defnName, this.content, this.next, this.isDisabled);
            }
        }
        // static methods
        TalkNode._idNext = 0;
        GameFramework.TalkNode = TalkNode;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
