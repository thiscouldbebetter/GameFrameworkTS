"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ProjectileShooter extends GameFramework.EntityPropertyBase {
            constructor(name, generators) {
                super();
                this.name = name;
                this.generators = generators;
            }
            static default() {
                return ProjectileShooter.fromNameAndGenerator(ProjectileShooter.name, GameFramework.ProjectileGenerator.default());
            }
            static fromNameAndGenerator(name, generator) {
                return new ProjectileShooter(name, [generator]);
            }
            static fromNameAndGenerators(name, generators) {
                return new ProjectileShooter(name, generators);
            }
            static of(entity) {
                return entity.propertyByName(ProjectileShooter.name);
            }
            collideOnlyWithEntitiesHavingPropertiesNamedSet(values) {
                this.generators.forEach(generator => generator.generations.forEach(generation => generation.collideOnlyWithEntitiesHavingPropertiesNamedSet(values)));
                return this;
            }
            generatorByName(name) {
                return this.generators.find(x => x.name == name);
            }
            generatorDefault() {
                return this.generators[0];
            }
            // Clonable.
            clone() {
                return this;
            }
        }
        GameFramework.ProjectileShooter = ProjectileShooter;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
