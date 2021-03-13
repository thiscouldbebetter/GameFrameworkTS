"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Talker extends GameFramework.EntityProperty {
            constructor(conversationDefnName) {
                super();
                this.conversationDefnName = conversationDefnName;
            }
            talk(universe, world, place, entityTalker, entityTalkee) {
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
                var venueNext = new GameFramework.VenueControls(conversationAsControl, false);
                universe.venueNext = venueNext;
            }
        }
        GameFramework.Talker = Talker;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
