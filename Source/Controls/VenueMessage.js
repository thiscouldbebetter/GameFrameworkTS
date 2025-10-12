"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VenueMessage {
            constructor(messageToShow, acknowledge, venuePrev, sizeInPixels, acknowledgeButtonIsSuppressed, backgroundIsTransparent, secondsToShow) {
                this.messageToShow = messageToShow;
                this._acknowledge = acknowledge;
                this.venuePrev = venuePrev;
                this._sizeInPixels = sizeInPixels;
                this.acknowledgeButtonIsSuppressed = acknowledgeButtonIsSuppressed || false;
                this.backgroundIsTransparent = backgroundIsTransparent || false;
                this.secondsToShow = secondsToShow;
            }
            static fromMessage(message) {
                return VenueMessage.fromMessageAndAcknowledge(message, null);
            }
            static fromMessageAcknowledgeAndSize(messageToShow, acknowledge, sizeInPixels) {
                return new VenueMessage(messageToShow, acknowledge, null, // venuePrev
                sizeInPixels, null, // acknowledgeButtonIsSuppressed
                null, // backgroundIsTransparent
                null // secondsToShow
                );
            }
            static fromMessageAcknowledgeAndVenuePrev(messageToShow, acknowledge, venuePrev) {
                return new VenueMessage(messageToShow, acknowledge, venuePrev, null, null, null, null);
            }
            static fromMessageAndAcknowledge(messageToShow, acknowledge) {
                return new VenueMessage(messageToShow, acknowledge, null, null, null, null, null);
            }
            static fromMessageAcknowledgeVenuePrevSizeAndAcknowledgeButtonSuppressed(messageToShow, acknowledge, venuePrev, sizeInPixels, acknowledgeButtonIsSuppressed) {
                return new VenueMessage(messageToShow, acknowledge, venuePrev, sizeInPixels, acknowledgeButtonIsSuppressed, null, // backgroundIsTransparent
                null // secondsToShow
                );
            }
            static fromText(text) {
                return VenueMessage.fromMessage(GameFramework.DataBinding.fromGet((c) => text));
            }
            static fromTextAndAcknowledge(text, acknowledge) {
                return VenueMessage.fromMessageAndAcknowledge(GameFramework.DataBinding.fromGet((c) => text), acknowledge);
            }
            static fromTextAndAcknowledgeNoButtons(text, acknowledge) {
                return VenueMessage.fromMessageAndAcknowledge(GameFramework.DataBinding.fromGet((c) => text), acknowledge).acknowledgeButtonIsSuppressedSet(true).backgroundIsTransparentSet(true);
            }
            static fromTextNoButtons(text) {
                return VenueMessage.fromMessage(GameFramework.DataBinding.fromGet((c) => text)).acknowledgeButtonIsSuppressedSet(true).backgroundIsTransparentSet(true);
            }
            static fromTextAcknowledgeAndSize(text, acknowledge, sizeInPixels) {
                return VenueMessage.fromMessageAcknowledgeAndSize(GameFramework.DataBinding.fromGet((c) => text), acknowledge, sizeInPixels);
            }
            static fromTextAcknowledgeAndVenuePrev(text, acknowledge, venuePrev) {
                return VenueMessage.fromMessageAcknowledgeAndVenuePrev(GameFramework.DataBinding.fromGet((c) => text), acknowledge, venuePrev);
            }
            // instance methods
            acknowledge(uwpe) {
                var universe = uwpe.universe;
                this._acknowledge(uwpe);
                var venueNext = universe.venueNext() || universe.venuePrev();
                universe.venueNextSet(venueNext);
            }
            acknowledgeButtonIsSuppressedSet(value) {
                this.acknowledgeButtonIsSuppressed = value;
                return this;
            }
            backgroundIsTransparentSet(value) {
                this.backgroundIsTransparent = value;
                return this;
            }
            draw(universe) {
                this.venueInner(universe).draw(universe);
            }
            finalize(universe) {
                this._venueInner.finalize(universe);
            }
            finalizeIsComplete() {
                return this._venueInner.finalizeIsComplete();
            }
            initialize(universe) {
                var venueInner = this.venueInner(universe);
                venueInner.initialize(universe);
            }
            initializeIsComplete(universe) {
                var venueInner = this.venueInner(universe);
                return venueInner.initializeIsComplete(universe);
            }
            updateForTimerTick(universe) {
                var venueInner = this.venueInner(universe);
                venueInner.updateForTimerTick(universe);
            }
            secondsToShowSet(value) {
                this.secondsToShow = value;
                return this;
            }
            sizeInPixels(universe) {
                if (this._sizeInPixels == null) {
                    this._sizeInPixels = universe.display.sizeDefault().clone();
                }
                return this._sizeInPixels;
            }
            venueInner(universe) {
                if (this._venueInner == null) {
                    var sizeInPixels = this.sizeInPixels(universe);
                    var fontNameAndHeight = GameFramework.FontNameAndHeight.default();
                    var controlMessage = universe.controlBuilder.message(universe, sizeInPixels, this.messageToShow, this.acknowledge.bind(this), this.acknowledgeButtonIsSuppressed, this.backgroundIsTransparent, fontNameAndHeight, this.secondsToShow);
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
