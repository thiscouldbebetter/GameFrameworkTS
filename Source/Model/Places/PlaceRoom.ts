
namespace ThisCouldBeBetter.GameFramework
{

export class PlaceRoom extends Place
{
	randomizerSeed: number;

	constructor(name: string, defnName: string, size: Coords, entities: Entity[], randomizerSeed: number)
	{
		super(name, defnName, size, entities);
		this.randomizerSeed = randomizerSeed;
	}
}

}
