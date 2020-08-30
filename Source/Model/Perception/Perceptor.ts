
class Perceptor extends EntityProperty
{
	sightThreshold: number;
	hearingThreshold: number;

	constructor(sightThreshold: number, hearingThreshold: number)
	{
		super();
		this.sightThreshold = sightThreshold;
		this.hearingThreshold = hearingThreshold;
	}
}
