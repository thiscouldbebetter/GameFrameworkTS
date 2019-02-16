
function Quaternion(w, x, y, z)
{
	this.w = w;
	this.x = x;
	this.y = y;
	this.z = z;
}

{
	// static methods

	Quaternion.fromAxisAndCyclesToRotate = function(axisToRotateAround, cyclesToRotate)
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

	Quaternion.prototype.transformCoordsAsRotation = function(coordsToRotate)
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

	Quaternion.prototype.clone = function()
	{
		return new Quaternion(this.w, this.x, this.y, this.z);
	};

	Quaternion.prototype.divide = function(divisor)
	{
		this.w /= divisor;
		this.x /= divisor;
		this.y /= divisor;
		this.z /= divisor;

		return this;
	};

	Quaternion.prototype.invert = function()
	{
		var magnitude = this.magnitude();

		this.divide(magnitude * magnitude);

		this.x *= -1;
		this.y *= -1;
		this.z *= -1;

		return this;
	};

	Quaternion.prototype.multiply = function(other)
	{
		return this.overwriteWithWXYZ
		(
			this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z,
			this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y,
			this.w * other.y - this.x * other.z + this.y * other.w + this.z * other.x,
			this.w * other.z + this.x * other.y - this.y * other.x + this.z * other.w
		);
	};

	Quaternion.prototype.magnitude = function()
	{
		return Math.sqrt
		(
			this.w * this.w
			+ this.x * this.x
			+ this.y * this.y
			+ this.z * this.z
		);
	};

	Quaternion.prototype.normalize = function()
	{
		return this.divide(this.magnitude());
	};

	Quaternion.prototype.overwriteWith = function(other)
	{
		this.overwriteWithWXYZ(other.w, other.x, other.y, other.z);

		return this;
	};

	Quaternion.prototype.overwriteWithWXYZ = function(w, x, y, z)
	{
		this.w = w;
		this.x = x;
		this.y = y;
		this.z = z;

		return this;
	};
}
