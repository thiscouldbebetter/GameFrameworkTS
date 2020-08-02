
class EntityBuilder
{
	messageFloater(text: string, pos: Coords)
	{
		var color = Color.byName("Red");
		var ticksToLive = 20;
		var riseSpeed = -1;
		var visual = new VisualText(new DataBinding(text, null, null), color, null);

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
