"use strict";
class ItemDefn {
    constructor(name, appearance, description, mass, tradeValue, stackSizeMax, categoryNames, use, visual) {
        this.name = name;
        this.appearance = appearance || name;
        this.description = description;
        this.mass = mass || 1;
        this.tradeValue = tradeValue;
        this.stackSizeMax = stackSizeMax || Number.POSITIVE_INFINITY;
        this.categoryNames = categoryNames || [];
        this._use = use;
        this.visual = visual;
    }
    static new1(name) {
        return new ItemDefn(name, null, null, null, null, null, null, null, null);
    }
    static fromNameCategoryNameAndUse(name, categoryName, use) {
        var returnValue = ItemDefn.new1(name);
        returnValue.categoryNames = [categoryName];
        returnValue.use = use;
        return returnValue;
    }
    static fromNameAndUse(name, use) {
        var returnValue = ItemDefn.new1(name);
        returnValue.use = use;
        return returnValue;
    }
    use(u, w, p, eUsing, eUsed) {
        var returnValue;
        if (this._use == null) {
            returnValue = "Can't use " + this.name + ".";
        }
        else {
            returnValue = this._use(u, w, p, eUsing, eUsed);
        }
        return returnValue;
    }
}
