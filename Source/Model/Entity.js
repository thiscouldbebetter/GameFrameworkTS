"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Entity {
            constructor(name, properties) {
                this.id = GameFramework.IDHelper.Instance().idNext();
                this.name = name || "_" + this.id;
                this.properties = properties;
                this.propertiesByName =
                    new Map(this.properties.map(x => [x.propertyName(), x]));
            }
            static fromNameAndProperties(name, properties) {
                return new Entity(name, properties);
            }
            static fromNameAndProperty(name, property) {
                return new Entity(name, [property]);
            }
            static fromProperty(property) {
                return new Entity(property.propertyName(), [property]);
            }
            finalize(uwpe) {
                uwpe.entitySet(this);
                var entityProperties = this.properties;
                for (var p = 0; p < entityProperties.length; p++) {
                    var property = entityProperties[p];
                    if (property.finalize != null) {
                        property.finalize(uwpe);
                    }
                }
                return this;
            }
            initialize(uwpe) {
                uwpe.entitySet(this);
                var entityProperties = this.properties;
                for (var p = 0; p < entityProperties.length; p++) {
                    var property = entityProperties[p];
                    if (property.initialize != null) {
                        property.initialize(uwpe);
                    }
                }
                return this;
            }
            nameSet(nameToSet) {
                this.name = nameToSet;
                return this;
            }
            propertiesActivateByNames(propertiesToActivateNames) {
                var propertiesToActivate = propertiesToActivateNames.map(x => this.propertyByName(x));
                propertiesToActivate.forEach(x => x.activate());
                return this;
            }
            propertiesAllActivate() {
                this.properties.forEach(x => x.inactivate());
                return this;
            }
            propertiesAllInactivate() {
                this.properties.forEach(x => x.inactivate());
                return this;
            }
            propertiesClear() {
                this.properties.length = 0;
                this.propertiesByName.clear();
                return this;
            }
            propertyAdd(propertyToAdd) {
                return this.propertyAddForPlace(propertyToAdd, null);
            }
            propertyAddForPlace(propertyToAdd, place) {
                this.properties.push(propertyToAdd);
                var propertyName = propertyToAdd.propertyName();
                this.propertiesByName.set(propertyName, propertyToAdd);
                if (place != null) {
                    var placeEntities = place.entitiesAll();
                    if (placeEntities.indexOf(this) >= 0) {
                        var propertyName = propertyToAdd.propertyName();
                        var entitiesWithProperty = place.entitiesByPropertyName(propertyName);
                        entitiesWithProperty.push(this);
                    }
                }
                return this;
            }
            propertyByName(name) {
                return this.propertiesByName.get(name);
            }
            propertyRemoveForPlace(propertyToRemove, place) {
                GameFramework.ArrayHelper.remove(this.properties, propertyToRemove);
                this.propertiesByName.delete(propertyToRemove.constructor.name);
                if (place != null) {
                    var propertyName = propertyToRemove.constructor.name;
                    var entitiesWithProperty = place.entitiesByPropertyName(propertyName);
                    GameFramework.ArrayHelper.remove(entitiesWithProperty, this);
                }
                return this;
            }
            propertyWithNameRemoveForPlace(propertyToRemoveName, place) {
                var propertyToRemove = this.propertyByName(propertyToRemoveName);
                this.propertyRemoveForPlace(propertyToRemove, place);
                return this;
            }
            updateForTimerTick(uwpe) {
                uwpe.entitySet(this);
                var entityProperties = this.properties;
                for (var p = 0; p < entityProperties.length; p++) {
                    var property = entityProperties[p];
                    if (property.updateForTimerTick != null) {
                        property.updateForTimerTick(uwpe);
                    }
                }
                return this;
            }
            // Cloneable.
            clone() {
                var nameCloned = this.name; // + IDHelper.Instance().idNext();
                var propertiesCloned = new Array();
                for (var i = 0; i < this.properties.length; i++) {
                    var property = this.properties[i];
                    var propertyAsAny = property;
                    var propertyCloned = (propertyAsAny.clone == null ?
                        propertyAsAny : propertyAsAny.clone());
                    propertiesCloned.push(propertyCloned);
                }
                var returnValue = new Entity(nameCloned, propertiesCloned);
                return returnValue;
            }
            overwriteWith(other) {
                throw new Error("Not yet implemented!");
            }
            // Equatable.
            equals(other) {
                var areAllPropertiesEqualSoFar = true;
                var thisProperties = this.properties;
                for (var i = 0; i < thisProperties.length; i++) {
                    var thisProperty = thisProperties[i];
                    var propertyName = thisProperty.propertyName();
                    var otherProperty = other.propertyByName(propertyName);
                    var propertiesAreEqual = thisProperty.equals(otherProperty);
                    if (propertiesAreEqual == false) {
                        areAllPropertiesEqualSoFar = false;
                        break;
                    }
                }
                var areEntitiesEqual = (this.name == other.name && areAllPropertiesEqualSoFar);
                return areEntitiesEqual;
            }
        }
        GameFramework.Entity = Entity;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
