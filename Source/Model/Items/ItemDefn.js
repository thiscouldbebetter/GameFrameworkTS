"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ItemDefn {
            constructor(name, appearance, description, encumbrance, tradeValue, stackSizeMax, categoryNames, use, visual, toEntity) {
                this.name = name;
                this.appearance = appearance || name;
                this.description = description;
                this.encumbrance = encumbrance || 1;
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
            static fromNameAndAppearance(name, appearance) {
                return new ItemDefn(name, appearance, null, null, null, null, null, null, null, null);
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
            static fromNameEncumbranceValueAndVisual(name, encumbrance, tradeValue, visual) {
                return new ItemDefn(name, null, null, encumbrance, tradeValue, null, null, null, visual, null);
            }
            static fromNameEncumbranceValueCategoryNamesUseAndVisual(name, encumbrance, tradeValue, categoryNames, use, visual) {
                return new ItemDefn(name, null, null, encumbrance, tradeValue, null, categoryNames, null, visual, null);
            }
            belongsToCategory(categoryToCheck) {
                return this.belongsToCategoryWithName(categoryToCheck.name);
            }
            belongsToCategoryWithName(categoryToCheckName) {
                return (this.categoryNames.indexOf(categoryToCheckName) >= 0);
            }
            categoryNameAdd(categoryName) {
                this.categoryNames.push(categoryName);
                return this;
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
            toItem() {
                return new GameFramework.Item(this.name, 1);
            }
            use(uwpe) {
                if (this._use == null) {
                    var itemHolder = GameFramework.ItemHolder.of(uwpe.entity);
                    itemHolder.statusMessageSet("Can't use " + this.appearance + ".");
                }
                else {
                    this._use(uwpe);
                }
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return ItemDefn.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
        }
        GameFramework.ItemDefn = ItemDefn;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
