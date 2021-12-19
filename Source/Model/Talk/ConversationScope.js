"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ConversationScope {
            constructor(parent, talkNodeCurrent, talkNodesForOptions) {
                this.parent = parent;
                this.talkNodeCurrent = talkNodeCurrent;
                this.isPromptingForResponse = false;
                this.talkNodesForOptions = talkNodesForOptions;
                this.talkNodesForOptionsByName =
                    GameFramework.ArrayHelper.addLookupsByName(this.talkNodesForOptions);
                this.displayTextCurrent = null;
                this.talkNodeForOptionSelected = null;
                this._talkNodesForOptionsActive = [];
                this._emptyArray = [];
                this.haveOptionsBeenUpdated = true;
            }
            node() {
                // Tersely named convenience method for scripts.
                return this.talkNodeForOptionSelected;
            }
            talkNodeAdvance(conversationRun) {
                var conversationDefn = conversationRun.defn;
                var defnTalkNodes = conversationDefn.talkNodes;
                var talkNodeInitial = this.talkNodeCurrent;
                while (this.talkNodeCurrent == talkNodeInitial
                    || this.talkNodeCurrent.isDisabled) {
                    var talkNodeIndex = defnTalkNodes.indexOf(this.talkNodeCurrent);
                    var talkNodeNext = defnTalkNodes[talkNodeIndex + 1];
                    this.talkNodeCurrent = talkNodeNext;
                }
                return this;
            }
            talkNodeNextSpecifiedOrAdvance(conversationRun) {
                var conversationDefn = conversationRun.defn;
                var nodeNextNameSpecified = this.talkNodeCurrent.next;
                if (nodeNextNameSpecified == null) {
                    this.talkNodeAdvance(conversationRun);
                }
                else {
                    this.talkNodeCurrent =
                        conversationDefn.talkNodeByName(nodeNextNameSpecified);
                }
                return this.talkNodeCurrent;
            }
            talkNodesForOptionsActive() {
                var returnValues;
                if (this.isPromptingForResponse == false) {
                    returnValues = this._emptyArray;
                }
                else {
                    if (this.haveOptionsBeenUpdated) {
                        this.haveOptionsBeenUpdated = false;
                        this._talkNodesForOptionsActive.length = 0;
                        for (var i = 0; i < this.talkNodesForOptions.length; i++) {
                            var talkNode = this.talkNodesForOptions[i];
                            if (talkNode.isEnabled()) {
                                this._talkNodesForOptionsActive.push(talkNode);
                            }
                        }
                    }
                    returnValues = this._talkNodesForOptionsActive;
                }
                return returnValues;
            }
            update(universe, conversationRun) {
                this.haveOptionsBeenUpdated = true;
                this.talkNodeCurrent.execute(universe, conversationRun, this);
            }
        }
        GameFramework.ConversationScope = ConversationScope;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
