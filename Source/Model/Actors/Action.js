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
            static fromNameAndPerform(name, perform) {
                return new Action(name, perform);
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
                this.DoNothing = Action.fromNameAndPerform("Do Nothing", (uwpe) => {
                    // Do nothing.
                });
                this.ShowMenuPlayer = Action.fromNameAndPerform("Show Menu Player", 
                // perform
                (uwpe) => {
                    var universe = uwpe.universe;
                    var actor = uwpe.entity;
                    var control = GameFramework.Controllable.of(actor).toControl(uwpe, null, "ShowMenuPlayer");
                    var venueNext = control.toVenue();
                    universe.venueTransitionTo(venueNext);
                });
                this.ShowMenuSettings = Action.fromNameAndPerform("Show Menu Settings", 
                // perform
                (uwpe) => {
                    var universe = uwpe.universe;
                    var controlBuilder = universe.controlBuilder;
                    var control = controlBuilder.gameAndSettings1(universe);
                    var venueNext = control.toVenue();
                    universe.venueTransitionTo(venueNext);
                });
            }
        }
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
