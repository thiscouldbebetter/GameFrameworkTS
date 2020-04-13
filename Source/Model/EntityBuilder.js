
class EntityBuilder
{
	messageFloater(text, pos)
	{
		var color = "Red";
		var ticksToLive = 20;
		var riseSpeed = -1;
		var visual = new VisualText(text, color);

		var messageEntity = new Entity
		(
			"Message" + text, // name
			[
				new Drawable(visual),
				new DrawableCamera(),
				new Ephemeral(ticksToLive),
				new Locatable
				(
					new Location(pos.clone()).velSet
					(
						new Coords(0, riseSpeed)
					)
				),
			]
		);

		return messageEntity;
	};
}
