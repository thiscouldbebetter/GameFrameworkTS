"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Damage {
            constructor(amountAsDiceRoll, typeName, effectsAndChances) {
                this.amountAsDiceRoll = amountAsDiceRoll;
                this.typeName = typeName;
                this.effectsAndChances = effectsAndChances || [];
            }
            static default() {
                return Damage.fromAmount(1);
            }
            static fromAmount(amount) {
                var amountAsDiceRoll = GameFramework.DiceRoll.fromOffset(amount);
                return new Damage(amountAsDiceRoll, null, null);
            }
            static fromAmountAndTypeName(amount, typeName) {
                var amountAsDiceRoll = GameFramework.DiceRoll.fromOffset(amount);
                return new Damage(amountAsDiceRoll, typeName, null);
            }
            static fromAmountAsDiceRoll(amountAsDiceRoll) {
                return new Damage(amountAsDiceRoll, null, null);
            }
            amount(randomizer) {
                var valueRolled = this.amountAsDiceRoll.roll(randomizer);
                return valueRolled;
            }
            effectsOccurring(randomizer) {
                var effectsOccurring = new Array();
                if (this.effectsAndChances != null) {
                    for (var i = 0; i < this.effectsAndChances.length; i++) {
                        var effectAndChance = this.effectsAndChances[i];
                        var chance = effectAndChance[1];
                        var roll = randomizer.getNextRandom();
                        if (roll <= chance) {
                            var effect = effectAndChance[0];
                            effectsOccurring.push(effect);
                        }
                    }
                }
                return effectsOccurring;
            }
            toString() {
                return this.amount + " " + (this.typeName || "");
            }
            type() {
                return GameFramework.DamageType.byName(this.typeName);
            }
        }
        GameFramework.Damage = Damage;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
