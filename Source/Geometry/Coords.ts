
namespace ThisCouldBeBetter.GameFramework
{

export class Coords
{
	x: number;
	y: number;
	z: number;

	constructor(x: number, y: number, z: number)
	{
		this.x = x;
		this.y = y;
		this.z = z;

		if (this.z == null)
		{
			this.z = 0;
		}
	}

	// constants

	static NumberOfDimensions = 3;

	// instances

	static _instances: Coords_Instances;
	static Instances()
	{
		if (Coords._instances == null)
		{
			Coords._instances = new Coords_Instances();
		}
		return Coords._instances;
	}

	// Static methods.

	static create(): Coords
	{
		return new Coords(0, 0, 0);
	}

	static default(): Coords
	{
		// Same as create().
		return new Coords(0, 0, 0);
	}

	static fromXY(x: number, y: number): Coords
	{
		return new Coords(x, y, 0);
	}

	static fromXYZ(x: number, y: number, z: number): Coords
	{
		return new Coords(x, y, z);
	}

	static oneOneZero(): Coords
	{
		return new Coords(1, 1, 0);
	}

	static ones(): Coords
	{
		return new Coords(1, 1, 1);
	}

	static random(randomizer: Randomizer)
	{
		return Coords.default().randomize(randomizer);
	}

	static twos(): Coords
	{
		return new Coords(2, 2, 2);
	}

	static zeroZeroOne(): Coords
	{
		return new Coords(0, 0, 1);
	}

	static zeroes(): Coords
	{
		// Same as create().
		return new Coords(0, 0, 0);
	}

	// Instance methods.

	absolute(): Coords
	{
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
		this.z = Math.abs(this.z);
		return this;
	}

	add(other: Coords): Coords
	{
		this.x += other.x;
		this.y += other.y;
		this.z += other.z;
		return this;
	}

	addDimensions(x: number, y: number, z: number): Coords
	{
		this.x += x;
		this.y += y;
		this.z += z;
		return this;
	}

	addXY(x: number, y: number): Coords
	{
		this.x += x;
		this.y += y;
		return this;
	}

	ceiling(): Coords
	{
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.z = Math.ceil(this.z);
		return this;
	}

	clear(): Coords
	{
		this.x = 0;
		this.y = 0;
		this.z = 0;
		return this;
	}

	clearZ(): Coords
	{
		this.z = 0;
		return this;
	}

	clone(): Coords
	{
		return new Coords(this.x, this.y, this.z);
	}

	crossProduct(other: Coords): Coords
	{
		return this.overwriteWithDimensions
		(
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x
		);
	}

	dimensionGet(dimensionIndex: number): number
	{
		var returnValue;

		if (dimensionIndex == 0)
		{
			returnValue = this.x;
		}
		else if (dimensionIndex == 1)
		{
			returnValue = this.y;
		}
		else if (dimensionIndex == 2)
		{
			returnValue = this.z;
		}

		return returnValue;
	}

	dimensionSet(dimensionIndex: number, valueToSet: number): Coords
	{
		if (dimensionIndex == 0)
		{
			this.x = valueToSet;
		}
		else if (dimensionIndex == 1)
		{
			this.y = valueToSet;
		}
		else if (dimensionIndex == 2)
		{
			this.z = valueToSet;
		}

		return this;
	}

	dimensions(): number[]
	{
		return [ this.x, this.y, this.z ];
	}

	directions(): Coords
	{
		if (this.x < 0)
		{
			this.x = -1;
		}
		else if (this.x > 0)
		{
			this.x = 1;
		}

		if (this.y < 0)
		{
			this.y = -1;
		}
		else if (this.y > 0)
		{
			this.y = 1;
		}

		if (this.z < 0)
		{
			this.z = -1;
		}
		else if (this.z > 0)
		{
			this.z = 1;
		}

		return this;
	}

	divide(other: Coords): Coords
	{
		this.x /= other.x;
		this.y /= other.y;
		this.z /= other.z;
		return this;
	}

	divideScalar(scalar: number): Coords
	{
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;
		return this;
	}

	dotProduct(other: Coords): number
	{
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}

	double(): Coords
	{
		return this.multiplyScalar(2);
	}

	equals(other: Coords): boolean
	{
		return (this.x == other.x && this.y == other.y && this.z == other.z);
	}

	equalsWithinError(other: Coords, errorMax: number): boolean
	{
		// Because in JavaScript, 1.1 - 1.0 = 0.10000000000000009.
		return (this.clone().subtract(other).magnitude() <= errorMax);
	}

	equalsWithinOneBillionth(other: Coords): boolean
	{
		return this.equalsWithinError(other, 0.000000001);
	}

	equalsXY(other: Coords): boolean
	{
		return (this.x == other.x && this.y == other.y);
	}

	floor(): Coords
	{
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);
		return this;
	}

	fromHeadingInTurns(headingInTurns: number): Coords
	{
		var headingInRadians = headingInTurns * Polar.RadiansPerTurn;

		this.x = Math.cos(headingInRadians);
		this.y = Math.sin(headingInRadians);

		return this;
	}

	half(): Coords
	{
		return this.divideScalar(2);
	}

	headingInTurns()
	{
		var returnValue;

		if (this.x == 0 && this.y == 0)
		{
			returnValue = null;
		}
		else
		{
			returnValue = Math.atan2(this.y, this.x) / (Math.PI * 2);

			if (returnValue < 0)
			{
				returnValue += 1;
			}

			returnValue = NumberHelper.wrapToRangeMinMax(returnValue, 0, 1);
		}

		return returnValue;
	}

	invert(): Coords
	{
		this.x = 0 - this.x;
		this.y = 0 - this.y;
		this.z = 0 - this.z;
		return this;
	}

	isInRangeMax(max: Coords)
	{
		return this.isInRangeMinMax(Coords.Instances().Zeroes, max);
	}

	isInRangeMaxExclusive(max: Coords)
	{
		return this.isInRangeMinInclusiveMaxExclusive(Coords.Instances().Zeroes, max);
	}

	isInRangeMaxExclusiveXY(max: Coords)
	{
		return this.isInRangeMinInclusiveMaxExclusiveXY(Coords.Instances().Zeroes, max);
	}

	isInRangeMinMax(min: Coords, max: Coords): boolean
	{
		var returnValue =
		(
			this.x >= min.x
			&& this.x <= max.x
			&& this.y >= min.y
			&& this.y <= max.y
			&& this.z >= min.z
			&& this.z <= max.z
		);

		return returnValue;
	}

	isInRangeMinMaxXY(min: Coords, max: Coords): boolean
	{
		var returnValue =
		(
			this.x >= min.x
			&& this.x <= max.x
			&& this.y >= min.y
			&& this.y <= max.y
		);

		return returnValue;
	}

	isInRangeMinInclusiveMaxExclusive(min: Coords, max: Coords): boolean
	{
		var returnValue =
		(
			this.x >= min.x
			&& this.x < max.x
			&& this.y >= min.y
			&& this.y < max.y
			&& this.z >= min.z
			&& this.z < max.z
		);

		return returnValue;
	}

	isInRangeMinInclusiveMaxExclusiveXY(min: Coords, max: Coords): boolean
	{
		var returnValue =
		(
			this.x >= min.x
			&& this.x < max.x
			&& this.y >= min.y
			&& this.y < max.y
		);

		return returnValue;
	}

	magnitude(): number
	{
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	magnitudeXY(): number
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	multiply(other: Coords): Coords
	{
		this.x *= other.x;
		this.y *= other.y;
		this.z *= other.z;
		return this;
	}

	multiplyDimensions(x: number, y: number, z: number): Coords
	{
		this.x *= x;
		this.y *= y;
		this.z *= z;
		return this;
	}

	multiplyScalar(scalar: number): Coords
	{
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;
	}

	normalize(): Coords
	{
		var magnitude = this.magnitude();
		if (magnitude > 0)
		{
			this.divideScalar(magnitude);
		}
		return this;
	}

	overwriteWith(other: Coords): Coords
	{
		this.x = other.x;
		this.y = other.y;
		this.z = other.z;
		return this;
	}

	overwriteWithDimensions(x: number, y: number, z: number): Coords
	{
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	overwriteWithXY(other: Coords): Coords
	{
		this.x = other.x;
		this.y = other.y;
		return this;
	}

	productOfDimensions(): number
	{
		return this.x * this.y * this.z;
	}

	randomize(randomizer: Randomizer): Coords
	{
		if (randomizer == null)
		{
			randomizer = RandomizerSystem.Instance();
		}
		this.x = randomizer.fraction();
		this.y = randomizer.fraction();
		this.z = randomizer.fraction();
		return this;
	}

	right(): Coords
	{
		var temp = this.y;
		this.y = this.x;
		this.x = 0 - temp;
		return this;
	}

	round(): Coords
	{
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		this.z = Math.round(this.z);
		return this;
	}

	roundToDecimalPlaces(numberOfPlaces: number)
	{
		this.x = NumberHelper.roundToDecimalPlaces(this.x, numberOfPlaces);
		this.y = NumberHelper.roundToDecimalPlaces(this.y, numberOfPlaces);
		this.z = NumberHelper.roundToDecimalPlaces(this.z, numberOfPlaces);
		return this;
	}

	subtract(other: Coords): Coords
	{
		this.x -= other.x;
		this.y -= other.y;
		this.z -= other.z;
		return this;
	}

	subtractWrappedToRangeMax(other: Coords, max: Coords): Coords
	{
		this.x = NumberHelper.subtractWrappedToRangeMax(this.x, other.x, max.x);
		this.y = NumberHelper.subtractWrappedToRangeMax(this.y, other.y, max.y);
		this.z = NumberHelper.subtractWrappedToRangeMax(this.z, other.z, max.z);
		return this;
	}

	sumOfDimensions(): number
	{
		return this.x + this.y + this.z;
	}

	trimToMagnitudeMax(magnitudeMax: number): Coords
	{
		var magnitude = this.magnitude();
		if (magnitude > magnitudeMax)
		{
			this.divideScalar(magnitude).multiplyScalar(magnitudeMax);
		}
		return this;
	}

	trimToRangeMax(max: Coords): Coords
	{
		if (this.x < 0)
		{
			this.x = 0;
		}
		else if (this.x > max.x)
		{
			this.x = max.x;
		}

		if (this.y < 0)
		{
			this.y = 0;
		}
		else if (this.y > max.y)
		{
			this.y = max.y;
		}

		if (this.z < 0)
		{
			this.z = 0;
		}
		else if (this.z > max.z)
		{
			this.z = max.z;
		}

		return this;
	}

	trimToRangeMaxXY(max: Coords): Coords
	{
		if (this.x < 0)
		{
			this.x = 0;
		}
		else if (this.x > max.x)
		{
			this.x = max.x;
		}

		if (this.y < 0)
		{
			this.y = 0;
		}
		else if (this.y > max.y)
		{
			this.y = max.y;
		}

		return this;
	}

	trimToRangeMinMax(min: Coords, max: Coords): Coords
	{
		if (this.x < min.x)
		{
			this.x = min.x;
		}
		else if (this.x >= max.x)
		{
			this.x = max.x;
		}

		if (this.y < min.y)
		{
			this.y = min.y;
		}
		else if (this.y >= max.y)
		{
			this.y = max.y;
		}

		if (this.z < min.z)
		{
			this.z = min.z;
		}
		else if (this.z >= max.z)
		{
			this.z = max.z;
		}

		return this;
	}

	valid(): boolean
	{
		var isValid =
			(isNaN(this.x) == false)
			&& (isNaN(this.y) == false)
			&& (isNaN(this.z) == false);

		return isValid;
	}

	wrapToRangeMax(max: Coords): Coords
	{
		while (this.x < 0)
		{
			this.x += max.x;
		}
		while (this.x >= max.x)
		{
			this.x -= max.x;
		}

		while (this.y < 0)
		{
			this.y += max.y;
		}
		while (this.y >= max.y)
		{
			this.y -= max.y;
		}

		if (max.z > 0)
		{
			while (this.z < 0)
			{
				this.z += max.z;
			}
			while (this.z >= max.z)
			{
				this.z -= max.z;
			}
		}

		return this;
	}

	xSet(value: number): Coords
	{
		this.x = value;
		return this;
	}

	ySet(value: number): Coords
	{
		this.y = value;
		return this;
	}

	zSet(value: number): Coords
	{
		this.z = value;
		return this;
	}

	// string

	toString()
	{
		return this.x + "x" + this.y + "x" + this.z;
	}

	toStringXY()
	{
		return this.x + "x" + this.y;
	}
}

class Coords_Instances
{
	HalfHalfZero: Coords;
	Halves: Coords;
	MinusOneZeroZero: Coords;
	Ones: Coords;
	OneOneZero: Coords;
	OneZeroZero: Coords;
	TwoTwoZero: Coords;
	ZeroZeroOne: Coords;
	ZeroMinusOneZero: Coords;
	ZeroOneZero: Coords;
	Zeroes: Coords;

	constructor()
	{
		this.HalfHalfZero = new Coords(.5, .5, 0);
		this.Halves = new Coords(.5, .5, .5);
		this.MinusOneZeroZero = new Coords(-1, 0, 0);
		this.Ones = new Coords(1, 1, 1);
		this.OneOneZero = new Coords(1, 1, 0);
		this.OneZeroZero = new Coords(1, 0, 0);
		this.TwoTwoZero = new Coords(2, 2, 0);
		this.ZeroZeroOne = new Coords(0, 0, 1);
		this.ZeroMinusOneZero = new Coords(0, -1, 0);
		this.ZeroOneZero = new Coords(0, 1, 0);
		this.Zeroes = Coords.create();
	}
}

}
