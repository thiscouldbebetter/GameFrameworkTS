"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ProjectileGenerator {
            constructor(name, projectileGenerations) {
                this.name = name;
                this.projectileGenerations = projectileGenerations;
            }
            static fromNameAndGenerations(name, projectileGenerations) {
                return new ProjectileGenerator(name, projectileGenerations);
            }
            static of(entity) {
                return entity.propertyByName(ProjectileGenerator.name);
            }
            static actionFire() {
                return new GameFramework.Action("Fire", 
                // perform
                (uwpe) => {
                    var place = uwpe.place;
                    var entityActor = uwpe.entity;
                    var projectileGenerator = ProjectileGenerator.of(entityActor);
                    var projectileEntities = projectileGenerator.projectileEntitiesFromEntityFiring(entityActor);
                    place.entitiesToSpawnAdd(projectileEntities);
                });
            }
            projectileEntitiesFromEntityFiring(entityFiring) {
                var returnValues = this.projectileGenerations.map(x => x.projectileEntityFromEntityFiring(entityFiring));
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
