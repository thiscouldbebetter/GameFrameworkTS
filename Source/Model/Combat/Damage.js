"use strict";
class Damage {
    constructor(amount, typeName) {
        this.amount = amount;
        this.typeName = typeName;
    }
    type() {
        return DamageType.byName(this.typeName);
    }
}
