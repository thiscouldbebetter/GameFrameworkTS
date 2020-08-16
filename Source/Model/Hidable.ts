
class Hidable extends EntityProperty
{
	isHidden: boolean;

	_isHiddenPrev: boolean;

	constructor(isHidden: boolean)
	{
		super();
		this.isHidden = isHidden;

		this._isHiddenPrev = null;
	}

	updateForTimerTick(u: Universe, w: World, p: Place, entity: Entity)
	{
		if (this.isHidden != this._isHiddenPrev)
		{
			this._isHiddenPrev = this.isHidden;

			if (this.isHidden)
			{
				entity.drawable().isVisible = false;
				if (entity.usable() != null)
				{
					entity.usable().isDisabled = true;
				}
			}
			else
			{
				entity.drawable().isVisible = true;
				if (entity.usable() != null)
				{
					entity.usable().isDisabled = false;
				}
			}
		}
	}

	// Clonable.

	clone()
	{
		return new Hidable(this.isHidden);
	}

	overwriteWith(other: Hidable)
	{
		this.isHidden = other.isHidden;
		return this;
	}
}
