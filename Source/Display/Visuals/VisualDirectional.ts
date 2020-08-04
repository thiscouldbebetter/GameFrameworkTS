
class VisualDirectional implements Visual
{
	visualForNoDirection: Visual;
	visualsForDirections: Visual[];

	numberOfDirections: number;

	constructor(visualForNoDirection: Visual, visualsForDirections: Visual[])
	{
		this.visualForNoDirection = visualForNoDirection;
		this.visualsForDirections = visualsForDirections;

		this.numberOfDirections = this.visualsForDirections.length;
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var loc = entity.locatable().loc;
		var headingInTurns = loc.orientation.headingInTurns();
		var visualForHeading;

		if (headingInTurns == null)
		{
			visualForHeading = this.visualForNoDirection;
		}
		else
		{
			var direction = NumberHelper.wrapToRangeMinMax
			(
				Math.round
				(
					headingInTurns * this.numberOfDirections
				),
				0, this.numberOfDirections
			);
			visualForHeading = this.visualsForDirections[direction];
		}

		visualForHeading.draw(universe, world, place, entity, display);
	};

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
