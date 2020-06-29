
class Quaternion
{
	constructor(w, x, y, z)
	{
		this.w = w;
		this.x = x;
		this.y = y;
		this.z = z;
	}

	// static methods

	static fromAxisAndCyclesToRotate(axisToRotateAround, cyclesToRotate)
	{
		var radiansToRotateHalf = cyclesToRotate * Math.PI;

		var sineOfRadiansToRotateHalf = Math.sin(radiansToRotateHalf);

		var w = Math.cos(radiansToRotateHalf);
		var x = axisToRotateAround.x * sineOfRadiansToRotateHalf;
		var y = axisToRotateAround.y * sineOfRadiansToRotateHalf;
		var z = axisToRotateAround.z * sineOfRadiansToRotateHalf;

		var returnValue = new Quaternion(w, x, y, z).normalize();

		return returnValue;
	};

	// instance methods

	transformCoordsAsRotation(coordsToRotate)
	{
		var coordsToRotateAsQuaternion = new Quaternion
		(
			0,
			coordsToRotate.x,
			coordsToRotate.y,
			coordsToRotate.z
		);

		var result = this.clone().multiply
		(
			coordsToRotateAsQuaternion
		).multiply
		(
			this.clone().invert()
		);

		coordsToRotate.overwriteWith(result);

		return coordsToRotate;
	};

	clone()
	{
		return new Quaternion(this.w, this.x, this.y, this.z);
	};

	divide(divisor)
	{
		this.w /= divisor;
		this.x /= divisor;
		this.y /= divisor;
		this.z /= divisor;

		return this;
	};

	invert()
	{
		var magnitude = this.magnitude();

		this.divide(magnitude * magnitude);

		this.x *= -1;
		this.y *= -1;
		this.z *= -1;

		return this;
	};

	multiply(other)
	{
		return this.overwriteWithWXYZ
		(
			this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z,
			this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y,
			this.w * other.y - this.x * other.z + this.y * other.w + this.z * other.x,
			this.w * other.z + this.x * other.y - this.y * other.x + this.z * other.w
		);
	};

	magnitude()
	{
		return Math.sqrt
		(
			this.w * this.w
			+ this.x * this.x
			+ this.y * this.y
			+ this.z * this.z
		);
	};

	normalize()
	{
		return this.divide(this.magnitude());
	};

	overwriteWith(other)
	{
		this.overwriteWithWXYZ(other.w, other.x, other.y, other.z);

		return this;
	};

	overwriteWithWXYZ(w, x, y, z)
	{
		this.w = w;
		this.x = x;
		this.y = y;
		this.z = z;

		return this;
	};
}
