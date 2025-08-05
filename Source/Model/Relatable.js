"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Relatable extends GameFramework.EntityPropertyBase {
            constructor(relationshipName, entityRelatedId) {
                super();
                this.relationshipName = relationshipName;
                this.entityRelatedId = entityRelatedId;
            }
            static fromRelationshipNameAndEntityRelatedId(relationshipName, entityRelatedId) {
                return new Relatable(relationshipName, entityRelatedId);
            }
            static of(entity) {
                return entity.propertyByName(Relatable.name);
            }
            // Clonable.
            clone() {
                return new Relatable(this.relationshipName, this.entityRelatedId);
            }
            overwriteWith(other) {
                this.relationshipName = other.relationshipName;
                this.entityRelatedId = other.entityRelatedId;
                return this;
            }
            // Equatable.
            equals(other) {
                var returnValue = this.relationshipName == other.relationshipName
                    && this.entityRelatedId == other.entityRelatedId;
                return returnValue;
            }
        }
        GameFramework.Relatable = Relatable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
