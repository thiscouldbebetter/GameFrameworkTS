
namespace ThisCouldBeBetter.GameFramework
{

export class VisualStack implements Visual
{
	childSpacing: Coords;
	children: Visual[];

	private _posSaved: Coords;

	constructor(childSpacing: Coords, children: Visual[])
	{
		this.childSpacing = childSpacing;
		this.children = children;

		this._posSaved = Coords.create();
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display)
	{
		var entity = uwpe.entity;
		var drawPos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawPos);

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			var wasChildVisible =
				child.draw(uwpe, display) as boolean;
			if (wasChildVisible)
			{
				drawPos.add(this.childSpacing);
			}
		}

		drawPos.overwriteWith(this._posSaved);
	}

	// Clonable.

	clone(): Visual
	{
		return new VisualStack(this.childSpacing.clone(), ArrayHelper.clone(this.children));
	}

	overwriteWith(other: Visual): Visual
	{
		var otherAsVisualStack = other as VisualStack;
		this.childSpacing.overwriteWith(otherAsVisualStack.childSpacing);
		ArrayHelper.overwriteWith(this.children, otherAsVisualStack.children);
		return this;
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		this.children.forEach(x => transformToApply.transform(x));
		return this;
	}
}

}
