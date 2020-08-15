"use strict";
class Damage {
    constructor(amount, typeName) {
        this.amount = amount;
        this.typeName = typeName;
    }
    toString() {
        return this.amount + " " + (this.typeName || "");
    }
    type() {
        return DamageType.byName(this.typeName);
    }
}
