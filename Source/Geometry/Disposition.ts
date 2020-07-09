
class Disposition
{
	pos: Coords;
	orientation: Orientation;
	placeName: string;

	vel: Coords;
	accel: Coords;
	force: Coords;
	spin: Rotation;
	timeOffsetInTicks: number;

	constructor(pos: Coords, orientation: Orientation, placeName: string)
	{
		this.pos = pos || new Coords(0, 0, 0);

		if (orientation == null)
		{
			orientation = Orientation.Instances().ForwardXDownZ.clone();
		}
		this.orientation = orientation;

		this.placeName = placeName;

		this.vel = new Coords(0, 0, 0);
		this.accel = new Coords(0, 0, 0);
		this.force = new Coords(0, 0, 0);

		this.spin = new Rotation(this.orientation.down, new Reference(0));

		this.timeOffsetInTicks = 0;
	}

	place(world: World)
	{
		return world.placesByName[this.placeName];
	};

	velSet(value: Coords)
	{
		this.vel.overwriteWith(value);
		return this;
	};

	// cloneable

	clone()
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
	};

	overwriteWith(other: Disposition)
	{
		this.placeName = other.placeName;
		this.pos.overwriteWith(other.pos);
		this.orientation.overwriteWith(other.orientation);
		this.vel.overwriteWith(other.vel);
		this.accel.overwriteWith(other.accel);
		this.force.overwriteWith(other.force);
		return this;
	};

	// strings

	toString()
	{
		return this.pos.clone().round().toString();
	};
}
