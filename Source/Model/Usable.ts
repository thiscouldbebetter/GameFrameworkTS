
class Usable
{
	_use: (u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity) => string;

	constructor(use: (u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity) => string)
	{
		this._use = use;
	}

	use(u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity): string
	{
		return this._use(u, w, p, eUsing, eUsed);
	}
}

