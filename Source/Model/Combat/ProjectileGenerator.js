"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ProjectileGenerator {
            constructor(name, fire, generations) {
                this.name = name;
                this._fire = fire || ProjectileGenerator.fireDefault;
                this.generations = generations;
            }
            static default() {
                var projectileGeneration = GameFramework.ProjectileGeneration.default();
                var projectileGenerator = ProjectileGenerator.fromNameFireAndGenerations(ProjectileGenerator.name, ProjectileGenerator.fireDefault, [
                    projectileGeneration
                ]);
                return projectileGenerator;
            }
            static fromNameAndGenerations(name, generations) {
                return new ProjectileGenerator(name, null, generations);
            }
            static fromNameGenerationAndFire(name, generation, fire) {
                return new ProjectileGenerator(name, fire, [generation]);
            }
            static fromNameGenerationsAndFire(name, generations, fire) {
                return new ProjectileGenerator(name, fire, generations);
            }
            static fromNameFireAndGenerations(name, fire, generations) {
                return new ProjectileGenerator(name, fire, generations);
            }
            static actionFire(generatorName) {
                return GameFramework.Action.fromNameAndPerform(generatorName, (uwpe) => this.actionFire_Perform(generatorName, uwpe));
            }
            static actionFire_Perform(generatorName, uwpe) {
                var entityFiring = uwpe.entity;
                var projectileShooter = GameFramework.ProjectileShooter.of(entityFiring);
                var projectileGenerator = projectileShooter.generatorByName(generatorName);
                projectileGenerator.fire(uwpe);
            }
            static fireDefault(uwpe) {
                var place = uwpe.place;
                var entityShooter = uwpe.entity;
                var shooter = GameFramework.ProjectileShooter.of(entityShooter);
                var generator = shooter.generatorDefault();
                var shotEntities = generator.toEntitiesFromEntityFiring(entityShooter);
                place.entitiesToSpawnAdd(shotEntities);
            }
            static fireGeneratorByName(generatorName, uwpe) {
                var place = uwpe.place;
                var entityShooter = uwpe.entity;
                var shooter = GameFramework.ProjectileShooter.of(entityShooter);
                var generator = shooter.generatorByName(generatorName);
                var shotEntities = generator.toEntitiesFromEntityFiring(entityShooter);
                place.entitiesToSpawnAdd(shotEntities);
            }
            fire(uwpe) {
                this._fire(uwpe);
            }
            range() {
                var generation0Range = this.generations[0].range();
                return generation0Range;
            }
            toEntitiesFromEntityFiring(entityFiring) {
                var returnValues = this.generations.map(x => x.toEntityFromEntityFiring(entityFiring));
                return returnValues;
            }
        }
        GameFramework.ProjectileGenerator = ProjectileGenerator;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
