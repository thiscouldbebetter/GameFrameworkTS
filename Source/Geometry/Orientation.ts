
namespace ThisCouldBeBetter.GameFramework
{

export class Orientation
{
	forward: Coords;
	down: Coords;
	right: Coords;

	axes: Coords[];
	axesRDF: Coords[];

	constructor(forward: Coords, down: Coords)
	{
		this.forward = forward || new Coords(1, 0, 0);
		this.forward = this.forward.clone().normalize();
		down = down || new Coords(0, 0, 1);
		this.right = down.clone().crossProduct(this.forward).normalize();
		this.down = this.forward.clone().crossProduct(this.right).normalize();

		this.axes = [ this.forward, this.right, this.down ];
		this.axesRDF = [ this.right, this.down, this.forward ];
	}

	static default()
	{
		return new Orientation(new Coords(1, 0, 0), new Coords(0, 0, 1));
	}

	default()
	{
		var coordsInstances = Coords.Instances();
		this.forwardDownSet(coordsInstances.OneZeroZero, coordsInstances.ZeroZeroOne);
	}

	// instances

	static _instances: Orientation_Instances;
	static Instances()
	{
		if (Orientation._instances == null)
		{
			Orientation._instances = new Orientation_Instances();
		}
		return Orientation._instances;
	}


	// methods

	clone()
	{
		return new Orientation(this.forward.clone(), this.down.clone());
	}

	equals(other: Orientation)
	{
		var returnValue =
		(
			this.forward.equals(other.forward)
			&& this.right.equals(other.right)
			&& this.down.equals(other.down)
		);
		return returnValue;
	}

	forwardSet(value: Coords)
	{
		this.forward.overwriteWith(value);
		return this.orthogonalize();
	}

	forwardDownSet(forward: Coords, down: Coords)
	{
		this.forward.overwriteWith(forward);
		this.down.overwriteWith(down);
		return this.orthogonalize();
	}

	orthogonalize()
	{
		this.forward.normalize();
		this.right.overwriteWith(this.down).crossProduct(this.forward).normalize();
		this.down.overwriteWith(this.forward).crossProduct(this.right).normalize();
		return this;
	}

	overwriteWith(other: Orientation)
	{
		this.forward.overwriteWith(other.forward);
		this.right.overwriteWith(other.right);
		this.down.overwriteWith(other.down);
		return this;
	}

	projectCoords(coordsToProject: Coords)
	{
		coordsToProject.overwriteWithDimensions
		(
			coordsToProject.dotProduct(this.forward),
			coordsToProject.dotProduct(this.right),
			coordsToProject.dotProduct(this.down)
		);
		return coordsToProject;
	}

	unprojectCoords(coordsToUnproject: Coords)
	{
		var returnValue = Coords.create();

		var axisScaled = Coords.create();

		for (var i = 0; i < this.axes.length; i++)
		{
			var axis = this.axes[i];

			axisScaled.overwriteWith(axis).multiplyScalar
			(
				coordsToUnproject.dimensionGet(i)
			);

			returnValue.add(axisScaled);
		}

		return coordsToUnproject.overwriteWith(returnValue);
	}

	projectCoordsRDF(coordsToProject: Coords)
	{
		coordsToProject.overwriteWithDimensions
		(
			coordsToProject.dotProduct(this.right),
			coordsToProject.dotProduct(this.down),
			coordsToProject.dotProduct(this.forward)
		);
		return coordsToProject;
	}

	unprojectCoordsRDF(coordsToUnproject: Coords)
	{
		var returnValue = Coords.create();

		var axisScaled = Coords.create();

		for (var i = 0; i < this.axesRDF.length; i++)
		{
			var axis = this.axesRDF[i];

			axisScaled.overwriteWith(axis).multiplyScalar
			(
				coordsToUnproject.dimensionGet(i)
			);

			returnValue.add(axisScaled);
		}

		return coordsToUnproject.overwriteWith(returnValue);
	}
}

export class Orientation_Instances
{
	ForwardXDownZ: Orientation;
	ForwardZDownY: Orientation;

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

}
