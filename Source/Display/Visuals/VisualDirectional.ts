
class VisualDirectional
{
	constructor(visualForNoDirection, visualsForDirections)
	{
		this.visualForNoDirection = visualForNoDirection;
		this.visualsForDirections = visualsForDirections;
		this.numberOfDirections = this.visualsForDirections.length;
	}

	draw(universe, world, display, entity)
	{
		var loc = entity.locatable.loc;
		var headingInTurns = loc.orientation.headingInTurns();
		var visualForHeading;

		if (headingInTurns == null)
		{
			visualForHeading = this.visualForNoDirection;
		}
		else
		{
			var direction =
				Math.round
				(
					headingInTurns * this.numberOfDirections
				).wrapToRangeMinMax(0, this.numberOfDirections);
			visualForHeading = this.visualsForDirections[direction];
		}

		visualForHeading.draw(universe, world, display, entity);
	};
}
