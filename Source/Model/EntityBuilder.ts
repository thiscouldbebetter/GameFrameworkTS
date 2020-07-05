
class EntityBuilder
{
	messageFloater(text, pos)
	{
		var color = "Red";
		var ticksToLive = 20;
		var riseSpeed = -1;
		var visual = new VisualText(text, color, null);

		var messageEntity = new Entity
		(
			"Message" + text, // name
			[
				new Drawable(visual, null),
				new DrawableCamera(),
				new Ephemeral(ticksToLive, null),
				new Locatable
				(
					new Disposition(pos.clone(), null, null).velSet
					(
						new Coords(0, riseSpeed, 0)
					)
				),
			]
		);

		return messageEntity;
	};
}
