
function EntityBuilder()
{
	// Do nothing.
}
{
	EntityBuilder.prototype.messageFloater = function(text, pos)
	{
		var color = "Red";
		var ticksToLive = 20;
		var riseSpeed = -1;

		var messageEntity = new Entity
		(
			"Message" + text, // name
			[
				new Drawable
				(
					new VisualCamera
					(
						new VisualText(text, color),
						(universe, world) => world.placeCurrent.camera()
					)
				),
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
