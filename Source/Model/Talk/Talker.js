"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Talker extends GameFramework.EntityPropertyBase {
            constructor(conversationDefnName, quit, toControl) {
                super();
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
                var conversationRun = this.toConversationRun(uwpe);
                this.conversationRunSet(conversationRun);
                var universe = uwpe.universe;
                var venueNext = new GameFramework.VenueConversationRun(conversationRun, universe);
                universe.venueTransitionTo(venueNext);
            }
            toConversationRun(uwpe) {
                var universe = uwpe.universe;
                var entityTalker = uwpe.entity;
                var entityTalkee = uwpe.entity2;
                var mediaLibrary = universe.mediaLibrary;
                var conversationDefnAsText = mediaLibrary.textStringGetByName(this.conversationDefnName).value;
                var conversationDefn = GameFramework.ConversationDefn.deserialize(conversationDefnAsText);
                var contentTextStringName = conversationDefn.contentTextStringName;
                var contentTextString = contentTextStringName == null
                    ? null
                    : mediaLibrary.textStringGetByName(contentTextStringName).value;
                conversationDefn.contentSubstituteFromString(contentTextString);
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
                var conversationRun = GameFramework.ConversationRun.fromDefnQuitTalkeeAndTalker(conversationDefn, conversationQuit, entityTalkee, entityTalker);
                return conversationRun;
            }
            // Controllable.
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
        }
        GameFramework.Talker = Talker;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
