"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EquipmentSocketDefn //
         {
            constructor(name, categoriesAllowedNames) {
                this.name = name;
                this.categoriesAllowedNames = categoriesAllowedNames;
            }
            static fromNameAndCategoriesAllowedNames(name, categoriesAllowedNames) {
                return new EquipmentSocketDefn(name, categoriesAllowedNames);
            }
        }
        GameFramework.EquipmentSocketDefn = EquipmentSocketDefn;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
