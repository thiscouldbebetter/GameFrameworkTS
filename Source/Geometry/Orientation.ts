
namespace ThisCouldBeBetter.GameFramework
{

export class Orientation
{
	forward: Coords;
	down: Coords;
	right: Coords;

	axes: Coords[];
	axesRDF: Coords[]; // "RDF" = "Right, Down, Forward".

	constructor(forward: Coords, down: Coords)
	{
		this.forward = forward || Coords.fromXYZ(1, 0, 0);
		this.forward = this.forward.clone().normalize();
		down = down || Coords.fromXYZ(0, 0, 1);
		this.right = down.clone().crossProduct(this.forward).normalize();
		this.down = this.forward.clone().crossProduct(this.right).normalize();

		this.axes = [ this.forward, this.right, this.down ];
		this.axesRDF = [ this.right, this.down, this.forward ];
	}

	static default(): Orientation
	{
		return new Orientation(new Coords(1, 0, 0), new Coords(0, 0, 1) );
	}

	static fromForward(forward: Coords): Orientation
	{
		return new Orientation(forward, new Coords(0, 0, 1) ); 
	}

	static fromForwardAndDown(forward: Coords, down: Coords): Orientation
	{
		return new Orientation(forward, down); 
	}

	default(): void
	{
		var coordsInstances = Coords.Instances();
		this.forwardDownSet(coordsInstances.OneZeroZero, coordsInstances.ZeroZeroOne);
	}

	// instances

	static _instances: Orientation_Instances;
	static Instances(): Orientation_Instances
	{
		if (Orientation._instances == null)
		{
			Orientation._instances = new Orientation_Instances();
		}
		return Orientation._instances;
	}


	// methods

	clone(): Orientation
	{
		return new Orientation(this.forward.clone(), this.down.clone());
	}

	equals(other: Orientation): boolean
	{
		var returnValue =
		(
			this.forward.equals(other.forward)
			&& this.right.equals(other.right)
			&& this.down.equals(other.down)
		);
		return returnValue;
	}

	forwardSet(value: Coords): Orientation
	{
		this.forward.overwriteWith(value);
		return this.orthogonalize();
	}

	forwardDownSet(forward: Coords, down: Coords): Orientation
	{
		this.forward.overwriteWith(forward);
		this.down.overwriteWith(down);
		return this.orthogonalize();
	}

	normalize(): Orientation
	{
		this.axes.forEach(x => x.normalize() );
		return this;
	}

	orthogonalize(): Orientation
	{
		this.forward.normalize();
		this.right.overwriteWith(this.down).crossProduct(this.forward).normalize();
		this.down.overwriteWith(this.forward).crossProduct(this.right).normalize();
		return this;
	}

	overwriteWith(other: Orientation): Orientation
	{
		this.forward.overwriteWith(other.forward);
		this.right.overwriteWith(other.right);
		this.down.overwriteWith(other.down);
		return this;
	}

	projectCoords(coordsToProject: Coords): Coords
	{
		coordsToProject.overwriteWithDimensions
		(
			coordsToProject.dotProduct(this.forward),
			coordsToProject.dotProduct(this.right),
			coordsToProject.dotProduct(this.down)
		);
		return coordsToProject;
	}

	unprojectCoords(coordsToUnproject: Coords): Coords
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

	projectCoordsRDF(coordsToProject: Coords): Coords
	{
		coordsToProject.overwriteWithDimensions
		(
			coordsToProject.dotProduct(this.right),
			coordsToProject.dotProduct(this.down),
			coordsToProject.dotProduct(this.forward)
		);
		return coordsToProject;
	}

	unprojectCoordsRDF(coordsToUnproject: Coords): Coords
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
		this.ForwardXDownZ = Orientation.fromForwardAndDown
		(
			Coords.fromXYZ(1, 0, 0), // forward
			Coords.fromXYZ(0, 0, 1) // down
		);

		this.ForwardZDownY = Orientation.fromForwardAndDown
		(
			Coords.fromXYZ(0, 0, 1), // forward
			Coords.fromXYZ(0, 1, 0) // down
		);
	}
}

}
