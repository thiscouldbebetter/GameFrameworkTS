"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EntityBuilder {
            explosion(pos, radius, soundName, ticksToLive, ephemeralExpire) {
                var explosionEntity = GameFramework.Entity.fromNameAndProperties("Explosion", [
                    GameFramework.Audible.create(),
                    GameFramework.Drawable.fromVisual(GameFramework.VisualGroup.fromChildren([
                        GameFramework.VisualSound.fromSoundName(soundName),
                        GameFramework.VisualBuilder.Instance().explosionStarburstOfRadius(radius)
                    ])),
                    GameFramework.Ephemeral.fromTicksAndExpire(ticksToLive, ephemeralExpire),
                    GameFramework.Locatable.fromPos(pos)
                ]);
                return explosionEntity;
            }
            messageFloater(text, font, pos, color) {
                var ticksToLive = 32;
                var riseSpeed = -1;
                var visual = GameFramework.VisualText.fromTextImmediateFontAndColor(text, font, color);
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
