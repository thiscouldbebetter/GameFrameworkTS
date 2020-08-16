
class Usable extends EntityProperty
{
	_use: (u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity) => string;

	isDisabled: boolean;

	constructor(use: (u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity) => string)
	{
		super();
		this._use = use;

		this.isDisabled = false;
	}

	use(u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity): string
	{
		if (this.isDisabled)
		{
			return null;
		}

		return this._use(u, w, p, eUsing, eUsed);
	}

	// Clonable.

	clone()
	{
		return new Usable(this._use);
	}

	overwriteWith(other: Usable)
	{
		this._use = other._use;
		return this;
	}
}

