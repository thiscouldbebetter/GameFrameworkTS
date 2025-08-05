
namespace ThisCouldBeBetter.GameFramework
{

export class Perceptor extends EntityPropertyBase<Perceptor>
{
	sightThreshold: number;
	hearingThreshold: number;

	constructor(sightThreshold: number, hearingThreshold: number)
	{
		super();

		this.sightThreshold = sightThreshold;
		this.hearingThreshold = hearingThreshold;
	}

	static fromThresholdsSightAndHearing
	(
		sightThreshold: number, hearingThreshold: number
	): Perceptor
	{
		return new Perceptor(sightThreshold, hearingThreshold);
	}

	static of(entity: Entity): Perceptor
	{
		return entity.propertyByName(Perceptor.name) as Perceptor;
	}

	// Clonable.

	clone(): Perceptor { return this; }

}

}
