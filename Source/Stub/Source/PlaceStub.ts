
class PlaceStub extends Place
{
	constructor()
	{
		super
		(
			PlaceStub.name,
			PlaceStub.defnBuild().name,
			Coords.fromXY(400, 300), // size
			[] // entities
		);
	}

	static defnBuild(): PlaceDefn
	{
		var actions = new Array<Action>();
		var actionToInputsMappings = new Array<ActionToInputsMapping>();
		var entityPropertyNamesToProcess =
		[
			// todo
		];

		return PlaceDefn.from4
		(
			PlaceStub.name,
			actions,
			actionToInputsMappings,
			entityPropertyNamesToProcess
		);
	}
}
