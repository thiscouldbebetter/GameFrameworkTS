
namespace ThisCouldBeBetter.GameFramework
{

export class Edge extends ShapeBase
{
	vertices: Coords[];

	_box: BoxAxisAligned;
	_direction: Coords;
	_displacement: Coords;
	_transverse: Coords;

	constructor(vertices: Coords[])
	{
		super();

		this.vertices = vertices || [ Coords.create(), Coords.create() ];

		this._direction = Coords.create();
		this._displacement = Coords.create();
		this._transverse = Coords.create();
	}

	static create(): Edge
	{
		return new Edge(null);
	}

	static fromVertex0And1(vertex0: Coords, vertex1: Coords): Edge
	{
		return new Edge( [ vertex0, vertex1 ] );
	}

	direction(): Coords
	{
		return this._direction.overwriteWith(this.displacement()).normalize();
	}

	displacement(): Coords
	{
		return this._displacement.overwriteWith(this.vertices[1]).subtract(this.vertices[0]);
	}

	length(): number
	{
		return this.displacement().magnitude();
	}

	projectOntoOther(other: Edge): Edge
	{
		var otherVertices = other.vertices;
		var otherVertex0 = otherVertices[0];
		var otherDirection = other.direction();
		var otherTransverse = other.transverse(Coords.Instances().ZeroZeroOne);

		for (var i = 0; i < this.vertices.length; i++)
		{
			var vertex = this.vertices[i];
			vertex.subtract(otherVertex0);
			vertex.overwriteWithDimensions
			(
				vertex.dotProduct(otherDirection),
				vertex.dotProduct(otherTransverse),
				0
			);
		}

		return this;
	}

	transverse(faceNormal: Coords): Coords
	{
		return this._transverse.overwriteWith(this.direction()).crossProduct(faceNormal);
	}

	// string

	toString(): string
	{
		return this.vertices.toString();
	}

	// Cloneable.

	clone(): Edge
	{
		return new Edge(ArrayHelper.clone(this.vertices));
	}

	overwriteWith(other: Edge): Edge
	{
		ArrayHelper.overwriteWith(this.vertices, other.vertices);
		return this;
	}

	// Equatable

	equals(other: Edge): boolean
	{
		return ArrayHelper.equals(this.vertices, other.vertices);
	}

	// ShapeBase.

	toBoxAxisAligned(boxOut: BoxAxisAligned): BoxAxisAligned
	{
		return boxOut.containPoints(this.vertices);
	}

	// Transformable.

	transform(transformToApply: TransformBase): Edge { throw new Error("Not implemented!");  }
}

}
