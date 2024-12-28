
namespace ThisCouldBeBetter.GameFramework
{

export class VisualTransformEntityPos implements Visual<VisualTransformEntityPos>
{
	transformToApply: TransformBase;
	child: VisualBase;

	private _entityPosSaved: Coords;

	constructor(transformToApply: TransformBase, child: VisualBase)
	{
		this.transformToApply = transformToApply;
		this.child = child;

		this._entityPosSaved = Coords.create();
	}

	// Cloneable.

	clone(): VisualTransformEntityPos
	{
		return new VisualTransformEntityPos(this.transformToApply, this.child.clone());
	}

	overwriteWith(other: VisualTransformEntityPos): VisualTransformEntityPos
	{
		this.child.overwriteWith(other.child);
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualTransformEntityPos
	{
		transformToApply.transform(this.child);
		return this;
	}

	// Visual.

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entityPos = Locatable.of(uwpe.entity).loc.pos;
		this._entityPosSaved.overwriteWith(entityPos);
		this.transformToApply.transformCoords(entityPos);
		this.child.draw(uwpe, display);
		entityPos.overwriteWith(this._entityPosSaved);
	}
}

}
