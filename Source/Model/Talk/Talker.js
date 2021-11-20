"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Talker {
            constructor(conversationDefnName) {
                this.conversationDefnName = conversationDefnName;
            }
            talk(uwpe) {
                var universe = uwpe.universe;
                var entityTalker = uwpe.entity;
                var entityTalkee = uwpe.entity2;
                var conversationDefnAsJSON = universe.mediaLibrary.textStringGetByName(this.conversationDefnName).value;
                var conversationDefn = GameFramework.ConversationDefn.deserialize(conversationDefnAsJSON);
                var venueToReturnTo = universe.venueCurrent;
                var conversation = new GameFramework.ConversationRun(conversationDefn, () => // quit
                 {
                    universe.venueNext = venueToReturnTo;
                }, entityTalkee, entityTalker // entityTalker
                );
                var conversationSize = universe.display.sizeDefault().clone();
                var conversationAsControl = conversation.toControl(conversationSize, universe);
                var venueNext = conversationAsControl.toVenue();
                universe.venueNext = venueNext;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Talker = Talker;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
