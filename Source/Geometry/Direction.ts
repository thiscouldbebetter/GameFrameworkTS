
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
	E: Coords;
	N: Coords;
	NE: Coords;
	NW: Coords;
	S: Coords;
	SE: Coords;
	SW: Coords;
	W: Coords;

	_ByHeading: Coords[];

	constructor()
	{
		this.E 		= Coords.fromXY(1, 0);
		this.N 		= Coords.fromXY(0, -1);
		this.NE 	= Coords.fromXY(1, -1);
		this.NW 	= Coords.fromXY(-1, -1);
		this.S 		= Coords.fromXY(0, 1);
		this.SE 	= Coords.fromXY(1, 1);
		this.SW 	= Coords.fromXY(-1, 1);
		this.W 		= Coords.fromXY(-1, 0);

		this._ByHeading =
		[
			this.E,
			this.SE,
			this.S,
			this.SW,
			this.W,
			this.NW,
			this.N,
			this.NE,
		];
	}
}

}
