
class PlaceRoom extends PlaceBase
{
	randomizerSeed: number;

	constructor
	(
		name: string,
		defnName: string,
		size: Coords,
		entities: Entity[],
		randomizerSeed: number
	)
	{
		super
		(
			name,
			defnName,
			null, // parentName
			size,
			ArrayHelper.addMany
			(
				[ CollisionTrackerMapped.fromSize(size).toEntity() ], // hack - Must come before collidables.
				entities
			)
		);
		this.randomizerSeed = randomizerSeed;
	}
}
