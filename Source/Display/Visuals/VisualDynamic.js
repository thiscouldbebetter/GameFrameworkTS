
class VisualDynamic
{
	constructor(methodForVisual)
	{
		this.methodForVisual = methodForVisual;
	}

	draw(universe, world, display, entity)
	{
		var visual = this.methodForVisual.call(this, universe, world, entity);
		visual.draw(universe, world, display, entity);
	};
}
