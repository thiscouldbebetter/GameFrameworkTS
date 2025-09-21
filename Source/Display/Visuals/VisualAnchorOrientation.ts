
namespace ThisCouldBeBetter.GameFramework
{

export class VisualAnchorOrientation extends VisualBase<VisualAnchorOrientation>
{
	child: Visual;
	orientationToAnchorAt: Orientation;

	_posSaved: Coords;
	_orientationSaved: Orientation;

	constructor
	(
		orientationToAnchorAt: Orientation,
		child: Visual
	)
	{
		super();

		this.child = child;
		this.orientationToAnchorAt = orientationToAnchorAt;

		// Helper variables.
		this._orientationSaved = new Orientation(null, null);
	}

	static fromOrientationAndChild
	(
		orientationToAnchorAt: Orientation,
		child: Visual
	): VisualAnchorOrientation
	{
		return new VisualAnchorOrientation(orientationToAnchorAt, child);
	}

	static fromChild
	(
		child: Visual
	): VisualAnchorOrientation
	{
		return new VisualAnchorOrientation
		(
			Orientation.default(), child
		);
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.child.initialize(uwpe);
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return this.child.initializeIsComplete(uwpe);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display)
	{
		var entity = uwpe.entity;
		var drawableLoc = Locatable.of(entity).loc;
		var drawableOrientation = drawableLoc.orientation;

		this._orientationSaved.overwriteWith(drawableOrientation);

		drawableOrientation.overwriteWith(this.orientationToAnchorAt);

		this.child.draw(uwpe, display);

		drawableOrientation.overwriteWith(this._orientationSaved);
	}

	// Clonable.

	clone(): VisualAnchorOrientation
	{
		return this; // todo
	}

	overwriteWith(other: VisualAnchorOrientation): VisualAnchorOrientation
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualAnchorOrientation
	{
		return this; // todo
	}
}

}
