
class VisualDirectional implements Visual
{
	visualForNoDirection: Visual;
	visualsForDirections: Visual[];
	_headingInTurnsGetForEntity: (e: Entity) => number;

	numberOfDirections: number;

	constructor
	(
		visualForNoDirection: Visual,
		visualsForDirections: Visual[],
		headingInTurnsGetForEntity: (e: Entity) => number
	)
	{
		this.visualForNoDirection = visualForNoDirection;
		this.visualsForDirections = visualsForDirections;
		this._headingInTurnsGetForEntity = headingInTurnsGetForEntity;

		this.numberOfDirections = this.visualsForDirections.length;
	}

	headingInTurnsGetForEntity(entity: Entity)
	{
		var returnValue: number = null;

		if (this._headingInTurnsGetForEntity == null)
		{
			var loc = entity.locatable().loc;
			returnValue = loc.orientation.forward.headingInTurns();
		}
		else
		{
			returnValue = this._headingInTurnsGetForEntity(entity)
		}

		return returnValue;
	}
	
	// Visual.

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var headingInTurns = this.headingInTurnsGetForEntity(entity);
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
