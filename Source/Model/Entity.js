"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Entity //
         {
            constructor(name, properties) {
                this.id = GameFramework.IDHelper.Instance().idNext();
                this.name = name;
                this.properties = properties;
                this.propertiesByName = new Map();
                for (var i = 0; i < this.properties.length; i++) {
                    var property = this.properties[i];
                    var propertyName = property.constructor.name;
                    this.propertiesByName.set(propertyName, property);
                }
            }
            finalize(uwpe) {
                uwpe.entity = this;
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
                uwpe.entity = this;
                var entityProperties = this.properties;
                for (var p = 0; p < entityProperties.length; p++) {
                    var property = entityProperties[p];
                    if (property.initialize != null) {
                        property.initialize(uwpe);
                    }
                }
                return this;
            }
            propertyAdd(propertyToAdd) {
                return this.propertyAddForPlace(propertyToAdd, null);
            }
            propertyAddForPlace(propertyToAdd, place) {
                this.properties.push(propertyToAdd);
                this.propertiesByName.set(propertyToAdd.constructor.name, propertyToAdd);
                if (place != null) {
                    if (place.entities.indexOf(this) >= 0) {
                        var propertyName = propertyToAdd.constructor.name;
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
            updateForTimerTick(uwpe) {
                uwpe.entity = this;
                var entityProperties = this.properties;
                for (var p = 0; p < entityProperties.length; p++) {
                    var property = entityProperties[p];
                    if (property.finalize != null) {
                        property.finalize(uwpe);
                    }
                }
                return this;
            }
            // Cloneable.
            clone() {
                var nameCloned = this.name; // + IDHelper.Instance().idNext();
                var propertiesCloned = [];
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
            // Equatable.
            equals(other) {
                var areAllPropertiesEqual = GameFramework.ArrayHelper.areEqual(this.properties, other.properties);
                var areEntitiesEqual = (this.name == other.name && areAllPropertiesEqual);
                return areEntitiesEqual;
            }
            // Convenience methods for properties.
            actor() { return this.propertyByName(GameFramework.Actor.name); }
            animatable() { return this.propertyByName(GameFramework.Animatable2.name); }
            audible() { return this.propertyByName(GameFramework.Audible.name); }
            boundable() { return this.propertyByName(GameFramework.Boundable.name); }
            camera() { return this.propertyByName(GameFramework.Camera.name); }
            collidable() { return this.propertyByName(GameFramework.Collidable.name); }
            constrainable() { return this.propertyByName(GameFramework.Constrainable.name); }
            controllable() { return this.propertyByName(GameFramework.Controllable.name); }
            damager() { return this.propertyByName(GameFramework.Damager.name); }
            device() { return this.propertyByName(GameFramework.Device.name); }
            drawable() { return this.propertyByName(GameFramework.Drawable.name); }
            effectable() { return this.propertyByName(GameFramework.Effectable.name); }
            ephemeral() { return this.propertyByName(GameFramework.Ephemeral.name); }
            equipmentUser() { return this.propertyByName(GameFramework.EquipmentUser.name); }
            equippable() { return this.propertyByName(GameFramework.Equippable.name); }
            enemy() { return this.propertyByName(GameFramework.Enemy.name); }
            forceField() { return this.propertyByName(GameFramework.ForceField.name); }
            item() { return this.propertyByName(GameFramework.Item.name); }
            itemContainer() { return this.propertyByName(GameFramework.ItemContainer.name); }
            itemCrafter() { return this.propertyByName(GameFramework.ItemCrafter.name); }
            itemDefn() { return this.propertyByName(GameFramework.ItemDefn.name); }
            itemHolder() { return this.propertyByName(GameFramework.ItemHolder.name); }
            itemStore() { return this.propertyByName(GameFramework.ItemStore.name); }
            journalKeeper() { return this.propertyByName(GameFramework.JournalKeeper.name); }
            killable() { return this.propertyByName(GameFramework.Killable.name); }
            loadable() { return this.propertyByName(GameFramework.Loadable.name); }
            locatable() { return this.propertyByName(GameFramework.Locatable.name); }
            movable() { return this.propertyByName(GameFramework.Movable.name); }
            obstacle() { return this.propertyByName(GameFramework.Obstacle.name); }
            phased() { return this.propertyByName(GameFramework.Phased.name); }
            recurrent() { return this.propertyByName(GameFramework.Recurrent.name); }
            perceptible() { return this.propertyByName(GameFramework.Perceptible.name); }
            perceptor() { return this.propertyByName(GameFramework.Perceptor.name); }
            playable() { return this.propertyByName(GameFramework.Playable.name); }
            portal() { return this.propertyByName(GameFramework.Portal.name); }
            projectileGenerator() { return this.propertyByName(GameFramework.ProjectileGenerator.name); }
            selectable() { return this.propertyByName(GameFramework.Selectable.name); }
            selector() { return this.propertyByName(GameFramework.Selector.name); }
            skillLearner() { return this.propertyByName(GameFramework.SkillLearner.name); }
            starvable() { return this.propertyByName(GameFramework.Starvable.name); }
            talker() { return this.propertyByName(GameFramework.Talker.name); }
            tirable() { return this.propertyByName(GameFramework.Tirable.name); }
            traversable() { return this.propertyByName(GameFramework.Traversable.name); }
            usable() { return this.propertyByName(GameFramework.Usable.name); }
        }
        GameFramework.Entity = Entity;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
