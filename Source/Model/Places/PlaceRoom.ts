
namespace ThisCouldBeBetter.GameFramework
{

export class PlaceRoom extends Place
{
	randomizerSeed: number;

	constructor(name: string, defnName: string, size: Coords, entities: Entity[], randomizerSeed: number)
	{
		super
		(
			name, defnName, size,
			ArrayHelper.addMany
			(
				[ CollisionTracker.fromSize(size).toEntity() ], // hack - Must come before collidables.
				entities
			)
		);
		this.randomizerSeed = randomizerSeed;
	}
}

}
