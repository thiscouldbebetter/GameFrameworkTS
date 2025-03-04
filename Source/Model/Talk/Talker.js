"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Talker {
            constructor(conversationDefnName, quit, toControl) {
                this.conversationDefnName = conversationDefnName;
                this.quit = quit;
                this._toControl = toControl;
            }
            static fromConversationDefnName(conversationDefnName) {
                return new Talker(conversationDefnName, null, null);
            }
            static of(entity) {
                return entity.propertyByName(Talker.name);
            }
            conversationRunSet(value) {
                this.conversationRun = value;
                return this;
            }
            talk(uwpe) {
                var universe = uwpe.universe;
                var entityTalker = uwpe.entity;
                var entityTalkee = uwpe.entity2;
                var mediaLibrary = universe.mediaLibrary;
                var conversationDefnAsText = mediaLibrary.textStringGetByName(this.conversationDefnName).value;
                var conversationDefn = GameFramework.ConversationDefn.deserialize(conversationDefnAsText);
                var contentTextStringName = conversationDefn.contentTextStringName;
                var contentTextString = contentTextStringName == null
                    ? null
                    : mediaLibrary.textStringGetByName(contentTextStringName);
                if (contentTextString != null) {
                    // hack - For a specific content tag format in a downstream project.
                    var contentText = contentTextString.value.split("\n#").join("\n\n#");
                    contentText = contentText.split("\n\n\n").join("\n\n");
                    var contentBlocks = contentText.split("\n\n");
                    var contentsById = new Map(contentBlocks.map(nodeAsBlock => {
                        var indexOfNewlineFirst = nodeAsBlock.indexOf("\n");
                        var contentIdLine = nodeAsBlock.substr(0, indexOfNewlineFirst);
                        var regexWhitespace = /\s+/;
                        var contentId = contentIdLine.split(regexWhitespace)[0];
                        var restOfBlock = nodeAsBlock.substr(indexOfNewlineFirst + 1);
                        return [contentId, restOfBlock];
                    }));
                    conversationDefn.contentSubstitute(contentsById);
                    //conversationDefn.displayNodesExpandByLines();
                }
                var conversationQuit = this.quit;
                if (conversationQuit == null) {
                    var venueToReturnTo = universe.venueCurrent();
                    conversationQuit = () => // quit
                     {
                        if (universe.venueNext() == null) // May be set or not based on the conversation.
                         {
                            universe.venueTransitionTo(venueToReturnTo);
                        }
                    };
                }
                var conversationRun = new GameFramework.ConversationRun(conversationDefn, conversationQuit, entityTalkee, entityTalker, // entityTalker
                null // contentsById
                );
                this.conversationRunSet(conversationRun);
                var venueNext = new GameFramework.VenueConversationRun(conversationRun, universe);
                universe.venueTransitionTo(venueNext);
            }
            toControl(conversationRun, size, universe) {
                var returnValue = null;
                if (this._toControl == null) {
                    returnValue = conversationRun.toControl(size, universe);
                }
                else {
                    returnValue = this._toControl(conversationRun, size, universe);
                }
                return returnValue;
            }
            // Clonable.
            clone() {
                return this;
            }
            overwriteWith(other) {
                return this;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Talker.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Talker = Talker;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
