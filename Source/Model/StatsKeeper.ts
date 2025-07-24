
namespace ThisCouldBeBetter.GameFramework
{

export class StatsKeeper implements EntityProperty<StatsKeeper>
{
	_statValuesByName: Map<string, number>;

	constructor()
	{
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

	StatNameKills = "Kills";
	StatNameShots = "Shots";

	shots(): number
	{
		return this.statValueByName(this.StatNameShots);
	}

	shotsIncrement(): void
	{
		this.statWithNameIncrement(this.StatNameShots);
	}

	kills(): number
	{
		return this.statValueByName(this.StatNameKills);
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
