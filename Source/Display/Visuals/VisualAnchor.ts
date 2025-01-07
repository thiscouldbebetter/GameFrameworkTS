
namespace ThisCouldBeBetter.GameFramework
{

export class VisualAnchor implements Visual<VisualAnchor>
{
	child: VisualBase;
	posToAnchorAt: Coords;
	orientationToAnchorAt: Orientation;

	_posSaved: Coords;
	_orientationSaved: Orientation;

	constructor
	(
		child: VisualBase,
		posToAnchorAt: Coords,
		orientationToAnchorAt: Orientation
	)
	{
		this.child = child;
		this.posToAnchorAt = posToAnchorAt;
		this.orientationToAnchorAt = orientationToAnchorAt;

		// Helper variables.
		this._posSaved = Coords.create();
		this._orientationSaved = new Orientation(null, null);
	}

	static fromChildAndPosToAnchorAt
	(
		child: VisualBase,
		posToAnchorAt: Coords
	): VisualAnchor
	{
		return new VisualAnchor(child, posToAnchorAt, null);
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.child.initialize(uwpe);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display)
	{
		var entity = uwpe.entity;
		var drawableLoc = Locatable.of(entity).loc;
		var drawablePos = drawableLoc.pos;
		var drawableOrientation = drawableLoc.orientation;

		this._posSaved.overwriteWith(drawablePos);
		this._orientationSaved.overwriteWith(drawableOrientation);

		if (this.posToAnchorAt != null)
		{
			drawablePos.overwriteWith(this.posToAnchorAt);
		}
		if (this.orientationToAnchorAt != null)
		{
			drawableOrientation.overwriteWith(this.orientationToAnchorAt);
		}

		this.child.draw(uwpe, display);

		drawablePos.overwriteWith(this._posSaved);
		drawableOrientation.overwriteWith(this._orientationSaved);
	}

	// Clonable.

	clone(): VisualAnchor
	{
		return this; // todo
	}

	overwriteWith(other: VisualAnchor): VisualAnchor
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualAnchor
	{
		return this; // todo
	}
}

}
