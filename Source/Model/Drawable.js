
function Drawable(visual)
{
	this.visual = visual;
}
{
	Drawable.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		this.loc = entity.Locatable.loc;
		this.visual.draw(universe, world, universe.display, this, entity);
	};
}
