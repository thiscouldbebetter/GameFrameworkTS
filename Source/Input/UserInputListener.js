"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class UserInputListener extends GameFramework.Entity {
            constructor() {
                super(UserInputListener.name, [
                    GameFramework.Actor.fromActivityDefnName(UserInputListener.activityDefnHandleUserInputBuild().name),
                    GameFramework.Drawable.fromVisual(UserInputListener.visualBuild()),
                    GameFramework.Selector.fromCursorDimension(20)
                ]);
            }
            static activityDefnHandleUserInputBuild() {
                return new GameFramework.ActivityDefn("HandleUserInput", UserInputListener.activityDefnHandleUserInputPerform);
            }
            static activityDefnHandleUserInputPerform(uwpe) {
                var universe = uwpe.universe;
                var world = uwpe.world;
                var place = uwpe.place;
                var inputHelper = universe.inputHelper;
                var placeDefn = place.defn(world);
                var actionsByName = placeDefn.actionsByName;
                var actionToInputsMappingsByInputName = placeDefn.actionToInputsMappingsByInputName;
                var actionsToPerform = inputHelper.actionsFromInput(actionsByName, actionToInputsMappingsByInputName);
                for (var i = 0; i < actionsToPerform.length; i++) {
                    var action = actionsToPerform[i];
                    action.perform(uwpe);
                }
            }
            static visualBuild() {
                var returnValue = new GameFramework.VisualSelect(
                // childrenByNames
                new Map([
                    ["None", new GameFramework.VisualNone()]
                ]), 
                // selectChildNames
                (uwpe, d) => {
                    return ["None"];
                });
                return returnValue;
            }
        }
        GameFramework.UserInputListener = UserInputListener;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
