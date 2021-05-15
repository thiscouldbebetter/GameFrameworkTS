"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class UserInputListener extends GameFramework.Entity {
            constructor() {
                super(UserInputListener.name, [
                    GameFramework.Actor.fromActivityDefnName(GameFramework.ActivityDefn.Instances().HandleUserInput.name)
                ]);
            }
            static activityDefnHandleUserInput() {
                return new GameFramework.ActivityDefn("HandleUserInput", UserInputListener.activityDefnHandleUserInputPerform);
            }
            static activityDefnHandleUserInputPerform(universe, world, place, entity) {
                var inputHelper = universe.inputHelper;
                var placeDefn = place.defn(world);
                var actionsByName = placeDefn.actionsByName;
                var actionToInputsMappingsByInputName = placeDefn.actionToInputsMappingsByInputName;
                var actionsToPerform = inputHelper.actionsFromInput(actionsByName, actionToInputsMappingsByInputName);
                for (var i = 0; i < actionsToPerform.length; i++) {
                    var action = actionsToPerform[i];
                    action.perform(universe, world, place, entity);
                }
            }
        }
        GameFramework.UserInputListener = UserInputListener;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));