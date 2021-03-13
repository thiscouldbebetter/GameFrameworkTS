
namespace ThisCouldBeBetter.GameFramework
{

export class Effect
{
	name: string;
	ticksPerCycle: number;
	cyclesToLive: number;
	visual: Visual;
	_updateForCycle: (u: Universe, w: World, p: Place, entity: Entity, effect: Effect) => any;

	ticksSoFar: number;

	constructor
	(
		name: string,
		ticksPerCycle: number,
		cyclesToLive: number,
		visual: Visual,
		updateForCycle: (u: Universe, w: World, p: Place, e: Entity, effect: Effect) => any
	)
	{
		this.name = name;
		this.ticksPerCycle = ticksPerCycle;
		this.cyclesToLive = cyclesToLive;
		this.visual = visual;
		this._updateForCycle = updateForCycle;
		this.ticksSoFar = 0;
	}

	static _instances: Effect_Instances;
	static Instances(): Effect_Instances
	{
		if (Effect._instances == null)
		{
			Effect._instances = new Effect_Instances();
		}
		return Effect._instances;
	}

	isCycleComplete()
	{
		return (this.ticksSoFar % this.ticksPerCycle == 0);
	}

	isDone()
	{
		return (this.ticksSoFar >= this.ticksToLive());
	}

	ticksToLive()
	{
		return this.ticksPerCycle * this.cyclesToLive;
	}

	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): any
	{
		var returnValue = null;

		if (this._updateForCycle != null)
		{
			if (this.isCycleComplete())
			{
				returnValue = this._updateForCycle(u, w, p, e, this);
			}
		}

		this.ticksSoFar++;

		return returnValue;
	}

	// Clonable.

	clone()
	{
		return new Effect
		(
			this.name,
			this.ticksPerCycle,
			this.cyclesToLive,
			this.visual,
			this._updateForCycle
		);
	}
}

class Effect_Instances
{
	Burning: Effect;
	Frozen: Effect;
	Healing: Effect;

	_All: Effect[];
	_AllByName: Map<string, Effect>;

	constructor()
	{
		var visualDimension = 5;
		this.Burning = new Effect
		(
			"Burning",
			20, // ticksPerCycle
			5, // cyclesToLive
			VisualBuilder.Instance().flame(visualDimension),
			(u: Universe, w: World, p: Place, e: Entity, effect: Effect) =>
			{
				e.killable().damageApply(u, w, p, null, e, new Damage(1, "Heat", null) );
			}
		);

		this.Frozen = new Effect
		(
			"Frozen",
			20, // ticksPerCycle
			5, // cyclesToLive
			new VisualCircle(visualDimension, Color.byName("Cyan"), null, null),
			(u: Universe, w: World, p: Place, e: Entity, effect: Effect) =>
			{
				e.killable().damageApply(u, w, p, null, e, new Damage(1, "Cold", null) );
			}
		);

		this.Healing = new Effect
		(
			"Healing",
			40, // ticksPerCycle
			10, // cyclesToLive
			new VisualPolygon
			(
				new Path
				([
					new Coords(-0.5, -0.2, 0),
					new Coords(-0.2, -0.2, 0),
					new Coords(-0.2, -0.5, 0),
					new Coords(0.2, -0.5, 0),
					new Coords(0.2, -0.2, 0),
					new Coords(0.5, -0.2, 0),
					new Coords(0.5, 0.2, 0),
					new Coords(0.2, 0.2, 0),
					new Coords(0.2, 0.5, 0),
					new Coords(-0.2, 0.5, 0),
					new Coords(-0.2, 0.2, 0),
					new Coords(-0.5, 0.2, 0)
				]).transform
				(
					Transform_Scale.fromScalar(visualDimension * 1.5)
				),
				Color.byName("Red"),
				null
			),
			(u: Universe, w: World, p: Place, e: Entity, effect: Effect) =>
			{
				e.killable().damageApply(u, w, p, null, e, new Damage(-1, "Healing", null) );
			}
		);

		this._All =
		[
			this.Burning,
			this.Frozen,
			this.Healing
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}

}
