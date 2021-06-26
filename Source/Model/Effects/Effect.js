"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
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
            updateForTimerTick(uwpe) {
                var returnValue = null;
                if (this._updateForCycle != null) {
                    if (this.isCycleComplete()) {
                        returnValue = this._updateForCycle(uwpe, this);
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
        GameFramework.Effect = Effect;
        class Effect_Instances {
            constructor() {
                var visualDimension = 5;
                this.Burning = new Effect("Burning", 20, // ticksPerCycle
                5, // cyclesToLive
                GameFramework.VisualBuilder.Instance().flame(visualDimension), (uwpe, effect) => {
                    var damage = GameFramework.Damage.fromAmountAndTypeName(1, "Heat");
                    var e = uwpe.entity;
                    uwpe.entity2 = e;
                    e.killable().damageApply(uwpe, damage);
                });
                this.Frozen = new Effect("Frozen", 20, // ticksPerCycle
                5, // cyclesToLive
                GameFramework.VisualCircle.fromRadiusAndColorFill(visualDimension, GameFramework.Color.byName("Cyan")), (uwpe, effect) => {
                    var damage = GameFramework.Damage.fromAmountAndTypeName(1, "Cold");
                    var e = uwpe.entity;
                    uwpe.entity2 = e;
                    e.killable().damageApply(uwpe, damage);
                });
                this.Healing = new Effect("Healing", 40, // ticksPerCycle
                10, // cyclesToLive
                GameFramework.VisualPolygon.fromPathAndColorFill(new GameFramework.Path([
                    new GameFramework.Coords(-0.5, -0.2, 0),
                    new GameFramework.Coords(-0.2, -0.2, 0),
                    new GameFramework.Coords(-0.2, -0.5, 0),
                    new GameFramework.Coords(0.2, -0.5, 0),
                    new GameFramework.Coords(0.2, -0.2, 0),
                    new GameFramework.Coords(0.5, -0.2, 0),
                    new GameFramework.Coords(0.5, 0.2, 0),
                    new GameFramework.Coords(0.2, 0.2, 0),
                    new GameFramework.Coords(0.2, 0.5, 0),
                    new GameFramework.Coords(-0.2, 0.5, 0),
                    new GameFramework.Coords(-0.2, 0.2, 0),
                    new GameFramework.Coords(-0.5, 0.2, 0)
                ]).transform(GameFramework.Transform_Scale.fromScalar(visualDimension * 1.5)), GameFramework.Color.byName("Red")), (uwpe, effect) => {
                    var damage = GameFramework.Damage.fromAmountAndTypeName(-1, "Healing");
                    var e = uwpe.entity;
                    uwpe.entity2 = e;
                    e.killable().damageApply(uwpe, damage);
                });
                this._All =
                    [
                        this.Burning,
                        this.Frozen,
                        this.Healing
                    ];
                this._AllByName = GameFramework.ArrayHelper.addLookupsByName(this._All);
            }
        }
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
