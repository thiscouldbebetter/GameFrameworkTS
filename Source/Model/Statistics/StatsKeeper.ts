
namespace ThisCouldBeBetter.GameFramework
{

export class StatsKeeper extends EntityPropertyBase<StatsKeeper>
{
	_statValuesByName: Map<string, number>;

	constructor()
	{
		super();

		this._statValuesByName = new Map<string, number>();
	}

	static create(): StatsKeeper
	{
		return new StatsKeeper();
	}

	static of(entity: Entity): StatsKeeper
	{
		return entity.propertyByName(StatsKeeper.name) as StatsKeeper;
	}

	statValueByName(name: string): number
	{
		if (this._statValuesByName.has(name) == false)
		{
			this._statValuesByName.set(name, 0);
		}

		return this._statValuesByName.get(name);
	}

	statWithNameAddValue(name: string, valueToAdd: number): void
	{
		this._statValuesByName.set
		(
			name,
			this.statValueByName(name) + valueToAdd
		);
	}

	statWithNameIncrement(name: string): void
	{
		this._statValuesByName.set
		(
			name,
			this.statValueByName(name) + 1
		);
	}

	statsClear(): StatsKeeper
	{
		this._statValuesByName.clear();
		return this;
	}

	// Common stats.

	StatNameScore = "Score";
	StatNameHits = "Hits";
	StatNameKills = "Kills";
	StatNameShots = "Shots";

	hits(): number
	{
		return this.statValueByName(this.StatNameHits);
	}

	hitsClear(): StatsKeeper
	{
		this._statValuesByName.set(this.StatNameHits, 0);
		return this;
	}

	hitsIncrement(): void
	{
		this.statWithNameIncrement(this.StatNameHits);
	}

	score(): number
	{
		return this.statValueByName(this.StatNameScore);
	}

	scoreAdd(valueToAdd: number): void
	{
		this.statWithNameAddValue(this.StatNameScore, valueToAdd);
	}

	shots(): number
	{
		return this.statValueByName(this.StatNameShots);
	}

	shotsClear(): StatsKeeper
	{
		this._statValuesByName.set(this.StatNameShots, 0);
		return this;
	}

	shotsIncrement(): void
	{
		this.statWithNameIncrement(this.StatNameShots);
	}

	kills(): number
	{
		return this.statValueByName(this.StatNameKills);
	}

	killsClear(): StatsKeeper
	{
		this._statValuesByName.set(this.StatNameKills, 0);
		return this;
	}

	killsIncrement(): void
	{
		this.statWithNameIncrement(this.StatNameKills);
	}

	// Clonable.

	clone(): StatsKeeper
	{
		throw new Error("todo");
	}

	overwriteWith(other: StatsKeeper): StatsKeeper
	{
		throw new Error("todo");
	}

	// Equatable

	equals(other: StatsKeeper): boolean { return false; } // todo

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}

	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	propertyName(): string { return StatsKeeper.name; }

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
}

}
