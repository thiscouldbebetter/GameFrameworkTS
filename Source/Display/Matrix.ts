
namespace ThisCouldBeBetter.GameFramework
{

export class Matrix
{
	// A 4x4 matrix for interacting with WebGL.

	values: number[];

	constructor(values: number[])
	{
		this.values = values;
	}

	// static methods

	static buildZeroes()
	{
		var returnValue = new Matrix
		([
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
		]);

		return returnValue;
	}

	// instance methods

	clone()
	{
		var valuesCloned = [];

		for (var i = 0; i < this.values.length; i++)
		{
			valuesCloned[i] = this.values[i];
		}

		var returnValue = new Matrix(valuesCloned);

		return returnValue;
	}

	divideScalar(scalar: number)
	{
		for (var i = 0; i < this.values.length; i++)
		{
			this.values[i] /= scalar;
		}

		return this;
	}

	multiply(other: Matrix)
	{
		// hack
		// Instantiates a new matrix.

		var valuesMultiplied = [];

		for (var y = 0; y < 4; y++)
		{
			for (var x = 0; x < 4; x++)
			{
				var valueSoFar = 0;

				for (var i = 0; i < 4; i++)
				{
					// This appears backwards,
					// but the other way doesn't work?
					valueSoFar +=
						other.values[y * 4 + i]
						* this.values[i * 4 + x];
				}

				valuesMultiplied[y * 4 + x] = valueSoFar;
			}
		}

		this.overwriteWithValues(valuesMultiplied);

		return this;
	}

	multiplyScalar(scalar: number)
	{
		for (var i = 0; i < this.values.length; i++)
		{
			this.values[i] *= scalar;
		}

		return this;
	}

	overwriteWith(other: Matrix)
	{
		for (var i = 0; i < this.values.length; i++)
		{
			this.values[i] = other.values[i];
		}

		return this;
	}

	overwriteWithOrientationEntity(orientation: Orientation)
	{
		var forward = orientation.forward;
		var right = orientation.right;
		var down = orientation.down;

		this.overwriteWithValues
		([
			forward.x, 	right.x, 	down.x, 	0,
			forward.y, 	right.y,	down.y, 	0,
			forward.z, 	right.z, 	down.z, 	0,
			0, 			0, 			0, 			1,
		]);


		return this;
	}

	overwriteWithOrientationCamera(orientation: Orientation)
	{
		var forward = orientation.forward;
		var right = orientation.right;
		var down = orientation.down;

		this.overwriteWithValues
		([
			right.x, 		right.y, 		right.z, 		0,
			0 - down.x, 	0 - down.y,		0 - down.z, 	0,
			0 - forward.x, 	0-forward.y, 	0 - forward.z, 	0,
			0, 				0, 				0, 				1
		]);

		return this;
	}

	overwriteWithOrientationMover(orientation: Orientation)
	{
		// hack
		// This function shouldn't even exist!
		// It should be possible to use the -Entity function for this,
		// but for some reason movers end up in the wrong place.

		// It looks like I needed to transpose the array
		// for some mathematical reason...

		var forward = orientation.forward;
		var right = orientation.right;
		var down = orientation.down;

		this.overwriteWithValues
		([
			forward.x, 	forward.y, 	forward.z,	0,
			right.x, 	right.y, 	right.z,	0,
			down.x, 	down.y,		down.z,		0,
			0, 			0, 			0, 			1
		]);

		return this;
	}

	overwriteWithPerspectiveForCamera(camera: Camera)
	{
		var viewSize = camera.viewSize;
		var clipDistanceNear = .001;//camera.focalLength;
		var clipDistanceFar = camera.viewSize.z;

		var scaleFactorY = 1.0 / Math.tan(viewSize.y / 2);
		var scaleFactorX = scaleFactorY * viewSize.y / viewSize.x;

		// hack
		// Trying to make the 3D perspective match the 2D one,
		// because I don't actually understand this math.
		// Must be adjusted if viewSize changes.

		var scaleFactorMultiplier =
			// .7; // For 320x240x1920.
			-1.2; // For 400x300x2400 and maybe 640x480x3840.
		scaleFactorX *= scaleFactorMultiplier;
		scaleFactorY *= scaleFactorMultiplier;

		var clipRange = clipDistanceNear - clipDistanceFar;
		var distanceFromFocusToClipPlaneFar = clipDistanceFar + clipDistanceNear;
		var clipDistanceSumOverDifference = distanceFromFocusToClipPlaneFar / clipRange;
		var clipDistanceProductOverDifference =
		(
			clipDistanceFar
			*
			clipDistanceNear
		) / clipRange;

		this.overwriteWithValues
		([
			scaleFactorX, 	0, 				0, 								0,
			0, 				scaleFactorY, 	0, 								0,
			0, 				0, 				clipDistanceSumOverDifference, 	2 * clipDistanceProductOverDifference,
			0, 				0, 				-1, 							0
		]);

		return this;
	}

	overwriteWithTranslate(displacement: Coords)
	{
		this.overwriteWithValues
		([
			1, 0, 0, displacement.x,
			0, 1, 0, displacement.y,
			0, 0, 1, displacement.z,
			0, 0, 0, 1,
		]);

		return this;
	}

	overwriteWithValues(otherValues: number[])
	{
		for (var i = 0; i < this.values.length; i++)
		{
			this.values[i] = otherValues[i];
		}

		return this;
	}

	toWebGLArray()
	{
		var returnValues = [];

		for (var x = 0; x < 4; x++)
		{
			for (var y = 0; y < 4; y++)
			{
				returnValues.push(this.values[(y * 4 + x)]);
			}
		}

		var returnValuesAsFloat32Array = new Float32Array(returnValues);

		return returnValuesAsFloat32Array;
	}
}

}
