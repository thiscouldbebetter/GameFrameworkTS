
namespace ThisCouldBeBetter.GameFramework
{

export class VisualDirectional implements Visual<VisualDirectional>
{
	visualForNoDirection: VisualBase;
	visualsForDirections: VisualBase[];
	_headingInTurnsGetForEntity: (e: Entity) => number;

	numberOfDirections: number;

	constructor
	(
		visualForNoDirection: VisualBase,
		visualsForDirections: VisualBase[],
		headingInTurnsGetForEntity: (e: Entity) => number
	)
	{
		this.visualForNoDirection = visualForNoDirection;
		this.visualsForDirections = visualsForDirections;
		this._headingInTurnsGetForEntity = headingInTurnsGetForEntity;

		this.numberOfDirections = this.visualsForDirections.length;
	}

	static fromVisuals
	(
		visualForNoDirection: VisualBase, visualsForDirections: VisualBase[],
	): VisualDirectional
	{
		return new VisualDirectional
		(
			visualForNoDirection, visualsForDirections, null
		);
	}

	headingInTurnsGetForEntity(entity: Entity): number
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

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
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

		visualForHeading.draw(uwpe, display);
	}

	// Clonable.

	clone(): VisualDirectional
	{
		return this; // todo
	}

	overwriteWith(other: VisualDirectional): VisualDirectional
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualDirectional
	{
		return this; // todo
	}
}

}
