
namespace ThisCouldBeBetter.GameFramework
{

export class EntityBuilder
{
	messageFloater(text: string, pos: Coords, color: Color)
	{
		var ticksToLive = 32;
		var riseSpeed = -1;
		var visual = VisualText.fromTextAndColor(text, color);
		pos = pos.clone();
		pos.z--;

		var messageEntity = new Entity
		(
			"Message" + text, // name
			[
				Drawable.fromVisual(visual),
				new Ephemeral(ticksToLive, null),
				new Locatable
				(
					Disposition.fromPos(pos).velSet
					(
						new Coords(0, riseSpeed, 0)
					)
				),
			]
		);

		return messageEntity;
	}
}

}
