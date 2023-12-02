
namespace ThisCouldBeBetter.GameFramework
{

export class EntityBuilder
{
	messageFloater
	(
		text: string,
		fontHeightInPixels: number,
		pos: Coords, color: Color
	): Entity
	{
		var ticksToLive = 32;
		var riseSpeed = -1;
		var visual = VisualText.fromTextImmediateHeightAndColor
		(
			text, fontHeightInPixels, color
		);
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
