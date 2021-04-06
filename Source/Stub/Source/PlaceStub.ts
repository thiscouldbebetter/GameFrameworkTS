
class PlaceStub extends Place
{
	constructor()
	{
		super
		(
			PlaceStub.name,
			PlaceStub.defnBuild().name,
			Coords.fromXY(400, 300), // size
			[] // places
		);
	}

	static defnBuild(): PlaceDefn
	{
		var actions = new Array<Action>();
		var mappings = new Array<ActionToInputsMapping>();
		var propertyNames = new Array<string>();

		return PlaceDefn.from4
		(
			PlaceStub.name, actions, mappings, propertyNames
		);
	}
}
