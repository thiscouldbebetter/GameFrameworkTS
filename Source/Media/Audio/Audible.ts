
namespace ThisCouldBeBetter.GameFramework
{

export class Audible extends EntityPropertyBase<Audible>
{
	soundPlayback: SoundPlayback;

	constructor()
	{
		super();
	}

	static create(): Audible
	{
		return new Audible();
	}

	static of(entity: Entity): Audible
	{
		return entity.propertyByName(Audible.name) as Audible;
	}

	soundPlaybackClear(): Audible
	{
		return this.soundPlaybackSet(null);
	}

	soundPlaybackSet(value: SoundPlayback): Audible
	{
		this.soundPlayback = value;
		return this;
	}
}

}
