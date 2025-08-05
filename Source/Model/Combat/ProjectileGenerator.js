"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ProjectileGenerator extends GameFramework.EntityPropertyBase {
            constructor(name, fire, generations) {
                super();
                this.name = name;
                this._fire = fire || ProjectileGenerator.fireDefault;
                this.generations = generations;
            }
            static fromNameAndGenerations(name, generations) {
                return new ProjectileGenerator(name, null, generations);
            }
            static fromNameFireAndGenerations(name, fire, generations) {
                return new ProjectileGenerator(name, fire, generations);
            }
            static of(entity) {
                return entity.propertyByName(ProjectileGenerator.name);
            }
            static actionFire() {
                return GameFramework.Action.fromNameAndPerform("Fire", this.actionFire_Perform);
            }
            static actionFire_Perform(uwpe) {
                var entityFiring = uwpe.entity;
                var projectileGenerator = ProjectileGenerator.of(entityFiring);
                projectileGenerator.fire(uwpe);
            }
            static fireDefault(uwpe) {
                var place = uwpe.place;
                var entityShooter = uwpe.entity;
                var generator = ProjectileGenerator.of(entityShooter);
                var shotEntities = generator.toEntitiesFromEntityFiring(entityShooter);
                place.entitiesToSpawnAdd(shotEntities);
            }
            fire(uwpe) {
                this._fire(uwpe);
            }
            toEntitiesFromEntityFiring(entityFiring) {
                var returnValues = this.generations.map(x => x.toEntityFromEntityFiring(entityFiring));
                return returnValues;
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return ProjectileGenerator.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.ProjectileGenerator = ProjectileGenerator;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
