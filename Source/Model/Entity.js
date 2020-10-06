"use strict";
class Entity {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties;
        this.propertiesByName = new Map();
        for (var i = 0; i < this.properties.length; i++) {
            var property = this.properties[i];
            var propertyName = property.constructor.name;
            this.propertiesByName.set(propertyName, property);
        }
    }
    finalize(universe, world, place) {
        var entityProperties = this.properties;
        for (var p = 0; p < entityProperties.length; p++) {
            var property = entityProperties[p];
            if (property.finalize != null) {
                property.finalize(universe, world, place, this);
            }
        }
    }
    initialize(universe, world, place) {
        var entityProperties = this.properties;
        for (var p = 0; p < entityProperties.length; p++) {
            var property = entityProperties[p];
            if (property.initialize != null) {
                property.initialize(universe, world, place, this);
            }
        }
    }
    propertyAddForPlace(propertyToAdd, place) {
        this.properties.push(propertyToAdd);
        this.propertiesByName.set(propertyToAdd.constructor.name, propertyToAdd);
        if (place != null) {
            var propertyName = propertyToAdd.constructor.name;
            var entitiesWithProperty = place.entitiesByPropertyName(propertyName);
            entitiesWithProperty.push(this);
        }
    }
    propertyByName(name) {
        return this.propertiesByName.get(name);
    }
    propertyRemoveForPlace(propertyToRemove, place) {
        ArrayHelper.remove(this.properties, propertyToRemove);
        this.propertiesByName.delete(propertyToRemove.constructor.name);
        if (place != null) {
            var propertyName = propertyToRemove.constructor.name;
            var entitiesWithProperty = place.entitiesByPropertyName(propertyName);
            ArrayHelper.remove(entitiesWithProperty, this);
        }
    }
    // Cloneable.
    clone() {
        var nameCloned = this.name; // + IDHelper.Instance().idNext();
        var propertiesCloned = [];
        for (var i = 0; i < this.properties.length; i++) {
            var property = this.properties[i];
            var propertyAsAny = property;
            var propertyCloned = (propertyAsAny.clone == null ? propertyAsAny : propertyAsAny.clone());
            propertiesCloned.push(propertyCloned);
        }
        var returnValue = new Entity(nameCloned, propertiesCloned);
        return returnValue;
    }
    // Convenience methods for properties.
    actor() { return this.propertyByName(Actor.name); }
    animatable() { return this.propertyByName(Animatable.name); }
    boundable() { return this.propertyByName(Boundable.name); }
    camera() { return this.propertyByName(Camera.name); }
    collidable() { return this.propertyByName(Collidable.name); }
    constrainable() { return this.propertyByName(Constrainable.name); }
    controllable() { return this.propertyByName(Controllable.name); }
    damager() { return this.propertyByName(Damager.name); }
    device() { return this.propertyByName(Device.name); }
    drawable() { return this.propertyByName(Drawable.name); }
    drawableCamera() { return this.propertyByName(DrawableCamera.name); }
    effectable() { return this.propertyByName(Effectable.name); }
    ephemeral() { return this.propertyByName(Ephemeral.name); }
    equipmentUser() { return this.propertyByName(EquipmentUser.name); }
    equippable() { return this.propertyByName(Equippable.name); }
    enemy() { return this.propertyByName(Enemy.name); }
    forceField() { return this.propertyByName(ForceField.name); }
    item() { return this.propertyByName(Item.name); }
    itemContainer() { return this.propertyByName(ItemContainer.name); }
    itemCrafter() { return this.propertyByName(ItemCrafter.name); }
    itemDefn() { return this.propertyByName(ItemDefn.name); }
    itemHolder() { return this.propertyByName(ItemHolder.name); }
    itemStore() { return this.propertyByName(ItemStore.name); }
    journalKeeper() { return this.propertyByName(JournalKeeper.name); }
    killable() { return this.propertyByName(Killable.name); }
    loadable() { return this.propertyByName(Loadable.name); }
    locatable() { return this.propertyByName(Locatable.name); }
    movable() { return this.propertyByName(Movable.name); }
    obstacle() { return this.propertyByName(Obstacle.name); }
    phased() { return this.propertyByName(Phased.name); }
    recurrent() { return this.propertyByName(Recurrent.name); }
    perceptible() { return this.propertyByName(Perceptible.name); }
    perceptor() { return this.propertyByName(Perceptor.name); }
    playable() { return this.propertyByName(Playable.name); }
    portal() { return this.propertyByName(Portal.name); }
    selector() { return this.propertyByName(Selector.name); }
    skillLearner() { return this.propertyByName(SkillLearner.name); }
    starvable() { return this.propertyByName(Starvable.name); }
    talker() { return this.propertyByName(Talker.name); }
    tirable() { return this.propertyByName(Tirable.name); }
    traversable() { return this.propertyByName(Traversable.name); }
    usable() { return this.propertyByName(Usable.name); }
}
