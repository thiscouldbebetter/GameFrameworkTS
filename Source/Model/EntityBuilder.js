"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EntityBuilder {
            messageFloater(text, fontHeightInPixels, pos, color) {
                var ticksToLive = 32;
                var riseSpeed = -1;
                var visual = GameFramework.VisualText.fromTextHeightAndColor(text, fontHeightInPixels, color);
                pos = pos.clone();
                pos.z--;
                var messageEntity = new GameFramework.Entity("Message" + text, // name
                [
                    GameFramework.Drawable.fromVisual(visual),
                    new GameFramework.Ephemeral(ticksToLive, null),
                    new GameFramework.Locatable(GameFramework.Disposition.fromPos(pos).velSet(new GameFramework.Coords(0, riseSpeed, 0))),
                ]);
                return messageEntity;
            }
        }
        GameFramework.EntityBuilder = EntityBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
