"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ItemDefn {
            constructor(name, appearance, description, mass, tradeValue, stackSizeMax, categoryNames, use, visual, toEntity) {
                this.name = name;
                this.appearance = appearance || name;
                this.description = description;
                this.mass = mass || 1;
                this.tradeValue = tradeValue;
                this.stackSizeMax = stackSizeMax || Number.POSITIVE_INFINITY;
                this.categoryNames = categoryNames || [];
                this._use = use;
                this.visual = visual;
                this._toEntity = toEntity;
            }
            static fromName(name) {
                return new ItemDefn(name, null, null, null, null, null, null, null, null, null);
            }
            static fromNameCategoryNameAndUse(name, categoryName, use) {
                var returnValue = ItemDefn.fromName(name);
                returnValue.categoryNames = [categoryName];
                returnValue.use = use;
                return returnValue;
            }
            static fromNameAndUse(name, use) {
                var returnValue = ItemDefn.fromName(name);
                returnValue.use = use;
                return returnValue;
            }
            static fromNameMassValueAndVisual(name, mass, tradeValue, visual) {
                return new ItemDefn(name, null, null, mass, tradeValue, null, null, null, visual, null);
            }
            toEntity(uwpe, item) {
                var returnValue;
                if (this._toEntity == null) {
                    returnValue = new GameFramework.Entity(this.name, [item]);
                }
                else {
                    returnValue = this._toEntity.call(this, uwpe, item);
                }
                return returnValue;
            }
            use(uwpe) {
                var returnValue;
                if (this._use == null) {
                    returnValue = "Can't use " + this.appearance + ".";
                }
                else {
                    returnValue = this._use(uwpe);
                }
                return returnValue;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
        }
        GameFramework.ItemDefn = ItemDefn;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
