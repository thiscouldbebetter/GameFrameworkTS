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
    propertyAdd(propertyToAdd) {
        this.properties.push(propertyToAdd);
        this.propertiesByName.set(propertyToAdd.constructor.name, propertyToAdd);
    }
    ;
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
    ;
    // Convenience methods for properties.
    actor() { return this.propertiesByName.get(Actor.name); }
    boundable() { return this.propertiesByName.get(Boundable.name); }
    camera() { return this.propertiesByName.get(Camera.name); }
    collidable() { return this.propertiesByName.get(Collidable.name); }
    constrainable() { return this.propertiesByName.get(Constrainable.name); }
    controllable() { return this.propertiesByName.get(Controllable.name); }
    damager() { return this.propertiesByName.get(Damager.name); }
    device() { return this.propertiesByName.get(Device.name); }
    drawable() { return this.propertiesByName.get(Drawable.name); }
    effectable() { return this.propertiesByName.get(Effectable.name); }
    ephemeral() { return this.propertiesByName.get(Ephemeral.name); }
    equipmentUser() { return this.propertiesByName.get(EquipmentUser.name); }
    equippable() { return this.propertiesByName.get(Equippable.name); }
    enemy() { return this.propertiesByName.get(Enemy.name); }
    item() { return this.propertiesByName.get(Item.name); }
    itemContainer() { return this.propertiesByName.get(ItemContainer.name); }
    itemCrafter() { return this.propertiesByName.get(ItemCrafter.name); }
    itemDefn() { return this.propertiesByName.get(ItemDefn.name); }
    itemHolder() { return this.propertiesByName.get(ItemHolder.name); }
    itemStore() { return this.propertiesByName.get(ItemStore.name); }
    journalKeeper() { return this.propertiesByName.get(JournalKeeper.name); }
    killable() { return this.propertiesByName.get(Killable.name); }
    loadable() { return this.propertiesByName.get(Loadable.name); }
    locatable() { return this.propertiesByName.get(Locatable.name); }
    movable() { return this.propertiesByName.get(Movable.name); }
    recurrent() { return this.propertiesByName.get(Recurrent.name); }
    perceptible() { return this.propertiesByName.get(Perceptible.name); }
    perceptor() { return this.propertiesByName.get(Perceptor.name); }
    playable() { return this.propertiesByName.get(Playable.name); }
    portal() { return this.propertiesByName.get(Portal.name); }
    skillLearner() { return this.propertiesByName.get(SkillLearner.name); }
    starvable() { return this.propertiesByName.get(Starvable.name); }
    talker() { return this.propertiesByName.get(Talker.name); }
    tirable() { return this.propertiesByName.get(Tirable.name); }
    traversable() { return this.propertiesByName.get(Traversable.name); }
    usable() { return this.propertiesByName.get(Usable.name); }
}
