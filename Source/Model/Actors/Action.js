"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Action {
            constructor(name, perform) {
                this.name = name;
                this.perform = perform;
            }
            performForUniverse(universe) {
                this.perform(universe, null, null, null);
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
                this.DoNothing = new Action("DoNothing", (u, w, p, e) => {
                    // Do nothing.
                });
                this.ShowMenu = new Action("ShowMenu", (universe, world, place, actor) => // perform
                 {
                    var control = actor.controllable().toControl(universe, universe.display.sizeInPixels, actor, universe.venueCurrent, true);
                    var venueNext = control.toVenue();
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                });
            }
        }
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
