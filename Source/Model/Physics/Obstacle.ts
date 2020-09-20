
class Obstacle extends EntityProperty
{
	constructor()
	{
		super();
	}

	// Clonable.

	clone()
	{
		return this;
	}

	overwriteWith(other: Obstacle)
	{
		return this;
	}
}
