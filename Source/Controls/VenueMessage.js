"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VenueMessage {
            constructor(messageToShow, acknowledge, venuePrev, sizeInPixels, showMessageOnly) {
                this.messageToShow = messageToShow;
                this._acknowledge = acknowledge;
                this.venuePrev = venuePrev;
                this._sizeInPixels = sizeInPixels;
                this.showMessageOnly = showMessageOnly || false;
            }
            static fromMessage(message) {
                return VenueMessage.fromMessageAndAcknowledge(message, null);
            }
            static fromMessageAcknowledgeAndSize(messageToShow, acknowledge, sizeInPixels) {
                return new VenueMessage(messageToShow, acknowledge, null, // venuePrev
                sizeInPixels, null // showMessageOnly
                );
            }
            static fromMessageAcknowledgeAndVenuePrev(messageToShow, acknowledge, venuePrev) {
                return new VenueMessage(messageToShow, acknowledge, venuePrev, null, null);
            }
            static fromMessageAndAcknowledge(messageToShow, acknowledge) {
                return new VenueMessage(messageToShow, acknowledge, null, null, null);
            }
            static fromText(text) {
                return VenueMessage.fromMessage(GameFramework.DataBinding.fromGet((c) => text));
            }
            static fromTextAcknowledgeAndSize(text, acknowledge, sizeInPixels) {
                return VenueMessage.fromMessageAcknowledgeAndSize(GameFramework.DataBinding.fromGet((c) => text), acknowledge, sizeInPixels);
            }
            static fromTextAndAcknowledge(text, acknowledge) {
                return VenueMessage.fromMessageAndAcknowledge(GameFramework.DataBinding.fromGet((c) => text), acknowledge);
            }
            static fromTextAcknowledgeAndVenuePrev(text, acknowledge, venuePrev) {
                return VenueMessage.fromMessageAcknowledgeAndVenuePrev(GameFramework.DataBinding.fromGet((c) => text), acknowledge, venuePrev);
            }
            // instance methods
            acknowledge(uwpe) {
                this._acknowledge(uwpe);
                var universe = uwpe.universe;
                universe.venuePrevJumpTo();
            }
            draw(universe) {
                this.venueInner(universe).draw(universe);
            }
            finalize(universe) { }
            initialize(universe) { }
            updateForTimerTick(universe) {
                var venueInner = this.venueInner(universe);
                venueInner.updateForTimerTick(universe);
            }
            sizeInPixels(universe) {
                if (this._sizeInPixels == null) {
                    this._sizeInPixels = universe.display.sizeInPixels.clone();
                }
                return this._sizeInPixels;
            }
            venueInner(universe) {
                if (this._venueInner == null) {
                    var sizeInPixels = this.sizeInPixels(universe);
                    var fontNameAndHeight = GameFramework.FontNameAndHeight.default();
                    var controlMessage = universe.controlBuilder.message(universe, sizeInPixels, this.messageToShow, this.acknowledge.bind(this), this.showMessageOnly, fontNameAndHeight);
                    var venuesToLayer = [];
                    if (this.venuePrev != null) {
                        venuesToLayer.push(this.venuePrev);
                    }
                    venuesToLayer.push(controlMessage.toVenue());
                    this._venueInner = new GameFramework.VenueLayered(venuesToLayer, null);
                }
                return this._venueInner;
            }
        }
        GameFramework.VenueMessage = VenueMessage;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
