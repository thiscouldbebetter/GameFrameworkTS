
namespace ThisCouldBeBetter.GameFramework
{

export class Collision
{
	pos: Coords;
	distanceToCollision: number;
	colliders: any[];
	collidersByName: Map<string,any>;

	collidables: Entity[];
	normals: Coords[];
	isActive: boolean;

	constructor(pos: Coords, distanceToCollision: number, colliders: any[])
	{
		this.pos = pos || new Coords(0, 0, 0);
		this.distanceToCollision = distanceToCollision;
		this.collidables = [];
		this.colliders = colliders || [];
		this.collidersByName = new Map<string,any>();
		this.normals = [ new Coords(0, 0, 0), new Coords(0, 0, 0) ];

		this.isActive = false;
	}

	static create()
	{
		return new Collision(new Coords(0, 0, 0), null, []);
	}

	clear()
	{
		this.isActive = false;
		ArrayHelper.clear(this.collidables);
		ArrayHelper.clear(this.colliders);
		this.collidersByName.clear();
		return this;
	}

	equals(other: Collision)
	{
		var returnValue =
		(
			this.isActive == other.isActive
			&&
			(
				this.isActive == false
				||
				(
					this.pos.equals(other.pos)
					&& this.distanceToCollision == other.distanceToCollision
					&& ArrayHelper.equals(this.colliders, other.colliders)
				)
			)
		);

		return returnValue;
	}
}

}
