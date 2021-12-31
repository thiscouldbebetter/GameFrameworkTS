
namespace ThisCouldBeBetter.GameFramework
{

export class Direction
{
	static _instances: Direction_Instances;
	static Instances()
	{
		if (Direction._instances == null)
		{
			Direction._instances = new Direction_Instances();
		}

		return Direction._instances;
	}
}

export class Direction_Instances
{
	East: Coords;
	North: Coords;
	Northeast: Coords;
	Northwest: Coords;
	South: Coords;
	Southeast: Coords;
	Southwest: Coords;
	West: Coords;

	_ByHeading: Coords[];

	constructor()
	{
		this.East 		= Coords.fromXY(1, 0);
		this.North 		= Coords.fromXY(0, -1);
		this.Northeast 	= Coords.fromXY(1, -1);
		this.Northwest 	= Coords.fromXY(-1, -1);
		this.South 		= Coords.fromXY(0, 1);
		this.Southeast 	= Coords.fromXY(1, 1);
		this.Southwest 	= Coords.fromXY(-1, 1);
		this.West 		= Coords.fromXY(-1, 0);

		this._ByHeading =
		[
			this.East,
			this.Southeast,
			this.South,
			this.Southwest,
			this.West,
			this.Northwest,
			this.North,
			this.Northeast
		];
	}
}

}
