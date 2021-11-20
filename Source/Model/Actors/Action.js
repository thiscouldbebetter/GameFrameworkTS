"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Action //
         {
            constructor(name, perform) {
                this.name = name;
                this._perform = perform;
            }
            perform(uwpe) {
                this._perform(uwpe);
            }
            performForUniverse(universe) {
                this.perform(GameFramework.UniverseWorldPlaceEntities.fromUniverse(universe));
            }
            static Instances() {
                if (Action._instances == null) {
                    Action._instances = new Action_Instances();
                }
                return Action._instances;
            }
        }
        GameFramework.Action = Action;
        class Action_Instances {
            constructor() {
                this.DoNothing = new Action("DoNothing", (uwpe) => {
                    // Do nothing.
                });
                this.ShowMenuPlayer = new Action("ShowMenuPlayer", 
                // perform
                (uwpe) => {
                    var universe = uwpe.universe;
                    var actor = uwpe.entity;
                    var control = actor.controllable().toControl(uwpe);
                    var venueNext = control.toVenue();
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                });
                this.ShowMenuSettings = new Action("ShowMenuSettings", 
                // perform
                (uwpe) => {
                    var universe = uwpe.universe;
                    var controlBuilder = universe.controlBuilder;
                    var control = controlBuilder.gameAndSettings1(universe);
                    var venueNext = control.toVenue();
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                });
            }
        }
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
