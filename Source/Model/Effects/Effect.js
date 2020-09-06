"use strict";
class Effect {
    constructor(name, ticksPerCycle, cyclesToLive, visual, updateForCycle) {
        this.name = name;
        this.ticksPerCycle = ticksPerCycle;
        this.cyclesToLive = cyclesToLive;
        this.visual = visual;
        this._updateForCycle = updateForCycle;
        this.ticksSoFar = 0;
    }
    static Instances() {
        if (Effect._instances == null) {
            Effect._instances = new Effect_Instances();
        }
        return Effect._instances;
    }
    isCycleComplete() {
        return (this.ticksSoFar % this.ticksPerCycle == 0);
    }
    isDone() {
        return (this.ticksSoFar >= this.ticksToLive());
    }
    ticksToLive() {
        return this.ticksPerCycle * this.cyclesToLive;
    }
    updateForTimerTick(u, w, p, e) {
        var returnValue = null;
        if (this._updateForCycle != null) {
            if (this.isCycleComplete()) {
                returnValue = this._updateForCycle(u, w, p, e, this);
            }
        }
        this.ticksSoFar++;
        return returnValue;
    }
    // Clonable.
    clone() {
        return new Effect(this.name, this.ticksPerCycle, this.cyclesToLive, this.visual, this._updateForCycle);
    }
}
class Effect_Instances {
    constructor() {
        var visualDimension = 5;
        this.Burning = new Effect("Burning", 20, // ticksPerCycle
        5, // cyclesToLive
        VisualBuilder.Instance().flame(visualDimension), (u, w, p, e, effect) => {
            e.killable().damageApply(u, w, p, null, e, new Damage(1, "Heat", null));
        });
        this.Frozen = new Effect("Frozen", 20, // ticksPerCycle
        5, // cyclesToLive
        new VisualCircle(visualDimension, Color.byName("Cyan"), null), (u, w, p, e, effect) => {
            e.killable().damageApply(u, w, p, null, e, new Damage(1, "Cold", null));
        });
        this.Healing = new Effect("Healing", 40, // ticksPerCycle
        10, // cyclesToLive
        new VisualPolygon(new Path([
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
        ]).transform(Transform_Scale.fromScalar(visualDimension * 1.5)), Color.byName("Red"), null), (u, w, p, e, effect) => {
            e.killable().damageApply(u, w, p, null, e, new Damage(-1, "Healing", null));
        });
        this._All =
            [
                this.Burning,
                this.Frozen,
                this.Healing
            ];
        this._AllByName = ArrayHelper.addLookupsByName(this._All);
    }
}
