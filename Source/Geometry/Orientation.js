
class Orientation
{
	constructor(forward, down)
	{
		this.forward = forward || new Coords(1, 0, 0);
		this.forward = this.forward.clone().normalize();
		down = down || new Coords(0, 0, 1);
		this.right = down.clone().crossProduct(this.forward).normalize();
		this.down = this.forward.clone().crossProduct(this.right).normalize();

		this.axes = [ this.forward, this.right, this.down ];
		this.axesRDF = [ this.right, this.down, this.forward ];
	}

	// instances

	static Instances()
	{
		if (Orientation._Instances == null)
		{
			Orientation._Instances = new Orientation_Instances();
		}
		return Orientation._Instances;
	};


	// methods

	clone()
	{
		return new Orientation(this.forward.clone(), this.down.clone());
	};

	forwardSet(value)
	{
		this.forward.overwriteWith(value);
		return this.orthogonalize();
	};

	forwardDownSet(forward, down)
	{
		this.forward.overwriteWith(forward);
		this.down.overwriteWith(down);
		return this.orthogonalize();
	};

	orthogonalize(value)
	{
		this.forward.normalize();
		this.right.overwriteWith(this.down).crossProduct(this.forward).normalize();
		this.down.overwriteWith(this.forward).crossProduct(this.right).normalize();
		return this;
	};

	overwriteWith(other)
	{
		this.forward.overwriteWith(other.forward);
		this.right.overwriteWith(other.right);
		this.down.overwriteWith(other.down);
		return this;
	};

	projectCoords(coords)
	{
		coords.overwriteWithDimensions
		(
			coords.dotProduct(this.forward),
			coords.dotProduct(this.right),
			coords.dotProduct(this.down)
		);
		return coords;
	};

	unprojectCoords(coords)
	{
		var returnValue = new Coords(0, 0, 0);

		var axisScaled = new Coords();

		for (var i = 0; i < this.axes.length; i++)
		{
			var axis = this.axes[i];

			axisScaled.overwriteWith(axis).multiplyScalar
			(
				coords.dimensionGet(i)
			);

			returnValue.add(axisScaled);
		}

		return coords.overwriteWith(returnValue);
	};

	projectCoordsRDF(coords)
	{
		coords.overwriteWithDimensions
		(
			coords.dotProduct(this.right),
			coords.dotProduct(this.down),
			coords.dotProduct(this.forward)
		);
		return coords;
	};

	unprojectCoordsRDF(coords)
	{
		var returnValue = new Coords(0, 0, 0);

		var axisScaled = new Coords();

		for (var i = 0; i < this.axesRDF.length; i++)
		{
			var axis = this.axesRDF[i];

			axisScaled.overwriteWith(axis).multiplyScalar
			(
				coords.dimensionGet(i)
			);

			returnValue.add(axisScaled);
		}

		return coords.overwriteWith(returnValue);
	};

	// heading

	headingInTurns()
	{
		var returnValue;

		var forward = this.forward;
		if (forward.x == 0 && forward.y == 0)
		{
			returnValue = null;
		}
		else
		{
			returnValue = Math.atan2(forward.y, forward.x) / (Math.PI * 2);

			if (returnValue < 0)
			{
				returnValue += 1;
			}

			returnValue = returnValue.wrapToRangeMinMax(0, 1);
		}

		return returnValue;
	};
}

class Orientation_Instances
{
	constructor()
	{
		this.ForwardXDownZ = new Orientation
		(
			new Coords(1, 0, 0), // forward
			new Coords(0, 0, 1) // down
		);

		this.ForwardZDownY = new Orientation
		(
			new Coords(0, 0, 1), // forward
			new Coords(0, 1, 0) // down
		);
	}
}
