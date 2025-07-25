
namespace ThisCouldBeBetter.GameFramework
{

export class Disposition
{
	pos: Coords;
	orientation: Orientation;
	_placeName: string;

	vel: Coords;
	accel: Coords;
	force: Coords;
	spin: Rotation;
	timeOffsetInTicks: number;

	constructor
	(
		pos: Coords,
		orientation: Orientation,
		placeName: string
	)
	{
		this.pos = pos || Coords.create();

		if (orientation == null)
		{
			orientation = Orientation.Instances().ForwardXDownZ.clone();
		}
		this.orientation = orientation;

		this.placeNameSet(placeName);

		this.vel = Coords.create();
		this.accel = Coords.create();
		this.force = Coords.create();

		this.spin = new Rotation(this.orientation.down, new Reference(0));

		this.timeOffsetInTicks = 0;
	}

	static create(): Disposition
	{
		return new Disposition(Coords.create(), Orientation.default(), null);
	}

	static default(): Disposition
	{
		return Disposition.create();
	}

	static from2
	(
		pos: Coords, orientation: Orientation
	): Disposition
	{
		return new Disposition(pos, orientation, null);
	}

	static fromOrientation(orientation: Orientation): Disposition
	{
		return new Disposition(Coords.create(), orientation, null);
	}

	static fromPos(pos: Coords): Disposition
	{
		return new Disposition(pos, Orientation.default(), null);
	}

	static fromPosAndOri
	(
		pos: Coords, ori: Orientation
	): Disposition
	{
		return new Disposition(pos, ori, null);
	}

	static fromPosAndOrientation
	(
		pos: Coords, ori: Orientation
	): Disposition
	{
		return new Disposition(pos, ori, null);
	}

	static fromPosAndVel(pos: Coords, vel: Coords): Disposition
	{
		var returnValue = Disposition.fromPos(pos);
		returnValue.vel = vel;
		return returnValue;
	}

	static fromPosOrientationAndPlaceName
	(
		pos: Coords, orientation: Orientation, placeName: string
	): Disposition
	{
		return new Disposition(pos, orientation, placeName);
	}

	clear(): Disposition
	{
		this.pos.clear();
		this.vel.clear();
		this.accel.clear();
		this.force.clear();
		return this;
	}

	equals(other: Disposition): boolean
	{
		var placeName = this.placeName();
		var otherPlaceName = other.placeName();

		var returnValue =
		(
			placeName == otherPlaceName
			&& this.pos.equals(other.pos)
			&& this.orientation.equals(other.orientation)
		);

		return returnValue;
	}

	place(world: World): Place
	{
		var placeName = this.placeName();
		return world.placeGetByName(placeName);
	}

	placeName(): string
	{
		return this._placeName;
	}

	placeNameSet(value: string): Disposition
	{
		this._placeName = value;
		return this;
	}

	velSet(value: Coords): Disposition
	{
		this.vel.overwriteWith(value);
		return this;
	}

	// cloneable

	clone(): Disposition
	{
		var returnValue = new Disposition
		(
			this.pos.clone(),
			this.orientation.clone(),
			this.placeName()
		);

		returnValue.vel = this.vel.clone();
		returnValue.accel = this.accel.clone();
		returnValue.force = this.force.clone();
		returnValue.timeOffsetInTicks = this.timeOffsetInTicks;

		return returnValue;
	}

	overwriteWith(other: Disposition): Disposition
	{
		var otherPlaceName = other.placeName();
		this.placeNameSet(otherPlaceName);
		this.pos.overwriteWith(other.pos);
		this.orientation.overwriteWith(other.orientation);
		this.vel.overwriteWith(other.vel);
		this.accel.overwriteWith(other.accel);
		this.force.overwriteWith(other.force);
		return this;
	}

	// strings

	toString(): string
	{
		return this.pos.clone().round().toString();
	}
}

}
