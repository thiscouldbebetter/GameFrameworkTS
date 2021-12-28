
namespace ThisCouldBeBetter.GameFramework
{

export class Disposition
{
	pos: Coords;
	orientation: Orientation;
	placeName: string;

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

		this.placeName = placeName;

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

	static fromOrientation(orientation: Orientation): Disposition
	{
		return new Disposition(Coords.create(), orientation, null);
	}

	static fromPos(pos: Coords): Disposition
	{
		return new Disposition(pos, Orientation.default(), null);
	}

	static fromPosAndOrientation
	(
		pos: Coords, orientation: Orientation
	): Disposition
	{
		return new Disposition(pos, orientation, null);
	}

	static fromPosAndVel(pos: Coords, vel: Coords): Disposition
	{
		var returnValue = Disposition.fromPos(pos);
		returnValue.vel = vel;
		return returnValue;
	}

	equals(other: Disposition): boolean
	{
		var returnValue =
		(
			this.placeName == other.placeName
			&& this.pos.equals(other.pos)
			&& this.orientation.equals(other.orientation)
		);

		return returnValue;
	}

	place(world: World): Place
	{
		return world.placeByName(this.placeName);
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
			this.placeName
		);

		returnValue.vel = this.vel.clone();
		returnValue.accel = this.accel.clone();
		returnValue.force = this.force.clone();
		returnValue.timeOffsetInTicks = this.timeOffsetInTicks;

		return returnValue;
	}

	overwriteWith(other: Disposition): Disposition
	{
		this.placeName = other.placeName;
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
