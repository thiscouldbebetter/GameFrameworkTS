
function Drawable(visual)
{
	this.visual = visual;
}
{
	Drawable.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		var loc = entity.locatable.loc;
		this.visual.drawToDisplayForDrawableAndLoc(Globals.Instance.display, entity, loc);
	}
}