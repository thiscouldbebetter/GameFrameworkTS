
namespace ThisCouldBeBetter.GameFramework
{

export class VisualHidable implements Visual<VisualHidable>
{
	_isVisible: (uwpe: UniverseWorldPlaceEntities) => boolean;
	child: VisualBase;

	constructor
	(
		isVisible: (uwpe: UniverseWorldPlaceEntities) => boolean,
		child: VisualBase
	)
	{
		this._isVisible = isVisible;
		this.child = child;
	}

	isVisible(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return this._isVisible(uwpe);
	}

	// Clonable.

	clone(): VisualHidable
	{
		return new VisualHidable(this._isVisible, this.child.clone());
	}

	overwriteWith(other: VisualHidable): VisualHidable
	{
		this._isVisible = other._isVisible;
		this.child = other.child;
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualHidable
	{
		return this; // todo
	}

	// VisualBase.

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var isVisible = this.isVisible(uwpe);
		if (isVisible)
		{
			this.child.draw(uwpe, display);
		}
	}

}

}
