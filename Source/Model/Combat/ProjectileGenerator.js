"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ProjectileGenerator {
            constructor(name, generations) {
                this.name = name;
                this.generations = generations;
            }
            static fromNameAndGenerations(name, generations) {
                return new ProjectileGenerator(name, generations);
            }
            static of(entity) {
                return entity.propertyByName(ProjectileGenerator.name);
            }
            static actionFire() {
                return GameFramework.Action.fromNameAndPerform("Fire", 
                // perform
                (uwpe) => {
                    var place = uwpe.place;
                    var entityShooter = uwpe.entity;
                    var generator = ProjectileGenerator.of(entityShooter);
                    var shotEntities = generator.toEntitiesFromEntityFiring(entityShooter);
                    place.entitiesToSpawnAdd(shotEntities);
                });
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
