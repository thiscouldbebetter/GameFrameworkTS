
namespace ThisCouldBeBetter.GameFramework
{

export class VisualAnchor implements Visual
{
	child: Visual;
	posToAnchorAt: Coords;
	orientationToAnchorAt: Orientation;

	_posSaved: Coords;
	_orientationSaved: Orientation;

	constructor(child: Visual, posToAnchorAt: Coords, orientationToAnchorAt: Orientation)
	{
		this.child = child;
		this.posToAnchorAt = posToAnchorAt;
		this.orientationToAnchorAt = orientationToAnchorAt;

		// Helper variables.
		this._posSaved = Coords.create();
		this._orientationSaved = new Orientation(null, null);
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var drawableLoc = entity.locatable().loc;
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

		this.child.draw(universe, world, place, entity, display);

		drawablePos.overwriteWith(this._posSaved);
		drawableOrientation.overwriteWith(this._orientationSaved);
	}

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}

}
