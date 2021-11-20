"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VenueMessage {
            constructor(messageToShow, acknowledge, venuePrev, sizeInPixels, showMessageOnly) {
                this.messageToShow = messageToShow;
                this.acknowledge = acknowledge;
                this.venuePrev = venuePrev;
                this._sizeInPixels = sizeInPixels;
                this.showMessageOnly = showMessageOnly || false;
            }
            static fromMessage(message) {
                return VenueMessage.fromMessageAndAcknowledge(message, null);
            }
            static fromMessageAndAcknowledge(messageToShow, acknowledge) {
                return new VenueMessage(messageToShow, acknowledge, null, null, null);
            }
            static fromText(message) {
                return VenueMessage.fromMessage(GameFramework.DataBinding.fromGet((c) => message));
            }
            // instance methods
            draw(universe) {
                this.venueInner(universe).draw(universe);
            }
            finalize(universe) { }
            initialize(universe) { }
            updateForTimerTick(universe) {
                this.venueInner(universe).updateForTimerTick(universe);
            }
            sizeInPixels(universe) {
                return (this._sizeInPixels == null ? universe.display.sizeInPixels : this._sizeInPixels);
            }
            venueInner(universe) {
                if (this._venueInner == null) {
                    var sizeInPixels = this.sizeInPixels(universe);
                    var controlMessage = universe.controlBuilder.message(universe, sizeInPixels, this.messageToShow, this.acknowledge, this.showMessageOnly);
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
