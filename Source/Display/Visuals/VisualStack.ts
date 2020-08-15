
class VisualStack implements Visual
{
	childSpacing: Coords;
	children: Visual[];

	private _posSaved: Coords;

	constructor(childSpacing: Coords, children: Visual[])
	{
		this.childSpacing = childSpacing;
		this.children = children;

		this._posSaved = new Coords(0, 0, 0);
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var drawPos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawPos);

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			var wasChildVisible =
				child.draw(universe, world, place, entity, display) as boolean;
			if (wasChildVisible)
			{
				drawPos.add(this.childSpacing);
			}
		}

		drawPos.overwriteWith(this._posSaved);
	};

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
