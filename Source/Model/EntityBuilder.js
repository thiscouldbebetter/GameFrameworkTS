"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EntityBuilder {
            messageFloater(text, pos, color) {
                var ticksToLive = 32;
                var riseSpeed = -1;
                var visual = GameFramework.VisualText.fromTextAndColor(text, color);
                pos = pos.clone();
                pos.z--;
                var messageEntity = new GameFramework.Entity("Message" + text, // name
                [
                    new GameFramework.Drawable(visual, null),
                    new GameFramework.DrawableCamera(),
                    new GameFramework.Ephemeral(ticksToLive, null),
                    new GameFramework.Locatable(new GameFramework.Disposition(pos, null, null).velSet(new GameFramework.Coords(0, riseSpeed, 0))),
                ]);
                return messageEntity;
            }
        }
        GameFramework.EntityBuilder = EntityBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
