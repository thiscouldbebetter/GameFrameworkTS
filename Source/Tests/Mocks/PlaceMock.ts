
class PlaceMock extends PlaceBase
{
	constructor()
	{
		super
		(
			PlaceMock.name,
			null, // defnName
			null, // parentName
			Coords.create(), // size
			[] // entities
		);
	}

	static create(): PlaceMock
	{
		return new PlaceMock();
	}
}