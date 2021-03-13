"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TalkNode {
            constructor(name, defnName, text, next, isActive) {
                this.name = (name == null ? TalkNode.idNext() : name);
                this.defnName = defnName;
                this.text = text;
                this.next = next;
                this.isActive = (isActive == null ? true : isActive);
            }
            static idNext() {
                var returnValue = "_" + TalkNode._idNext;
                TalkNode._idNext++;
                return returnValue;
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
            execute(universe, conversationRun, scope) {
                var defn = this.defn(conversationRun.defn);
                defn.execute(universe, conversationRun, scope, this);
            }
            textForTranscript(conversationDefn) {
                var speakerName = (this.defnName == "Option" ? "YOU" : "THEY");
                var returnValue = speakerName + ": " + this.text;
                return returnValue;
            }
        }
        // static methods
        TalkNode._idNext = 0;
        GameFramework.TalkNode = TalkNode;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
