
namespace ThisCouldBeBetter.GameFramework
{

export class EntityBuilder
{
	static _instance: EntityBuilder;
	static Instance(): EntityBuilder
	{
		if (this._instance == null)
		{
			this._instance = new EntityBuilder();
		}
		return this._instance;
	}

	explosion
	(
		pos: Coords,
		radius: number,
		soundName: string,
		ticksToLive: number,
		ephemeralExpire: (uwpe: UniverseWorldPlaceEntities) => void
	): Entity
	{
		var visualBuilder = VisualBuilder.Instance();
		var visualExplosion =
			//visualBuilder.explosionStarburstOfRadius(radius);
			visualBuilder.explosionSparks(radius * 10, radius / 5, 25, 30); // explosionRadius, sparkRadius, sparkCount, sparkTicksToLive

		var explosionEntity = Entity.fromNameAndProperties
		(
			"Explosion",
			[
				Audible.create(),

				Drawable.fromVisual
				(
					VisualGroup.fromChildren
					([
						VisualSound.fromSoundName(soundName),
						visualExplosion
					])
				),

				Ephemeral.fromTicksAndExpire
				(
					ticksToLive,
					ephemeralExpire
				),

				Locatable.fromPos(pos)
			]
		);

		return explosionEntity;
	}

	messageFloater
	(
		text: string,
		font: FontNameAndHeight,
		pos: Coords, color: Color
	): Entity
	{
		var ticksToLive = 32;
		var riseSpeed = -1;
		var visual = VisualText.fromTextImmediateFontAndColor
		(
			text, font, color
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
