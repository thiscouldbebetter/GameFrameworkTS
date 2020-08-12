"use strict";
class EntityBuilder {
    messageFloater(text, pos, color) {
        var ticksToLive = 32;
        var riseSpeed = -1;
        var visual = new VisualText(DataBinding.fromContext(text), null, color, null);
        pos = pos.clone();
        pos.z--;
        var messageEntity = new Entity("Message" + text, // name
        [
            new Drawable(visual, null),
            new DrawableCamera(),
            new Ephemeral(ticksToLive, null),
            new Locatable(new Disposition(pos, null, null).velSet(new Coords(0, riseSpeed, 0))),
        ]);
        return messageEntity;
    }
    ;
}
