"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EntityBuilder {
            static Instance() {
                if (this._instance == null) {
                    this._instance = new EntityBuilder();
                }
                return this._instance;
            }
            explosion(pos, radius, soundName, ticksToLive, ephemeralExpire) {
                var visualBuilder = GameFramework.VisualBuilder.Instance();
                var sparkRadius = radius / 5;
                var sparkTicksToLive = 30;
                var visualExplosion = visualBuilder.explosionSparks(sparkRadius, 25, // sparkCount
                sparkTicksToLive, soundName);
                var explosionEntity = GameFramework.Entity.fromNameAndProperties("Explosion", [
                    GameFramework.Audible.create(),
                    GameFramework.Drawable.fromVisual(visualExplosion),
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
                var messageEntity = GameFramework.Entity.fromNameAndProperties("Message" + text, // name
                [
                    GameFramework.Drawable.fromVisual(visual),
                    GameFramework.Ephemeral.fromTicksToLive(ticksToLive),
                    GameFramework.Locatable.fromDisposition(GameFramework.Disposition.fromPos(pos).velSet(new GameFramework.Coords(0, riseSpeed, 0))),
                ]);
                return messageEntity;
            }
        }
        GameFramework.EntityBuilder = EntityBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
