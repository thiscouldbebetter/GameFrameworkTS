"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Orientation {
            constructor(forward, down) {
                this.forward = forward || new GameFramework.Coords(1, 0, 0);
                this.forward = this.forward.clone().normalize();
                down = down || new GameFramework.Coords(0, 0, 1);
                this.right = down.clone().crossProduct(this.forward).normalize();
                this.down = this.forward.clone().crossProduct(this.right).normalize();
                this.axes = [this.forward, this.right, this.down];
                this.axesRDF = [this.right, this.down, this.forward];
            }
            static default() {
                return new Orientation(new GameFramework.Coords(1, 0, 0), new GameFramework.Coords(0, 0, 1));
            }
            static fromForward(forward) {
                return new Orientation(forward, new GameFramework.Coords(0, 0, 1));
            }
            default() {
                var coordsInstances = GameFramework.Coords.Instances();
                this.forwardDownSet(coordsInstances.OneZeroZero, coordsInstances.ZeroZeroOne);
            }
            static Instances() {
                if (Orientation._instances == null) {
                    Orientation._instances = new Orientation_Instances();
                }
                return Orientation._instances;
            }
            // methods
            clone() {
                return new Orientation(this.forward.clone(), this.down.clone());
            }
            equals(other) {
                var returnValue = (this.forward.equals(other.forward)
                    && this.right.equals(other.right)
                    && this.down.equals(other.down));
                return returnValue;
            }
            forwardSet(value) {
                this.forward.overwriteWith(value);
                return this.orthogonalize();
            }
            forwardDownSet(forward, down) {
                this.forward.overwriteWith(forward);
                this.down.overwriteWith(down);
                return this.orthogonalize();
            }
            orthogonalize() {
                this.forward.normalize();
                this.right.overwriteWith(this.down).crossProduct(this.forward).normalize();
                this.down.overwriteWith(this.forward).crossProduct(this.right).normalize();
                return this;
            }
            overwriteWith(other) {
                this.forward.overwriteWith(other.forward);
                this.right.overwriteWith(other.right);
                this.down.overwriteWith(other.down);
                return this;
            }
            projectCoords(coordsToProject) {
                coordsToProject.overwriteWithDimensions(coordsToProject.dotProduct(this.forward), coordsToProject.dotProduct(this.right), coordsToProject.dotProduct(this.down));
                return coordsToProject;
            }
            unprojectCoords(coordsToUnproject) {
                var returnValue = GameFramework.Coords.create();
                var axisScaled = GameFramework.Coords.create();
                for (var i = 0; i < this.axes.length; i++) {
                    var axis = this.axes[i];
                    axisScaled.overwriteWith(axis).multiplyScalar(coordsToUnproject.dimensionGet(i));
                    returnValue.add(axisScaled);
                }
                return coordsToUnproject.overwriteWith(returnValue);
            }
            projectCoordsRDF(coordsToProject) {
                coordsToProject.overwriteWithDimensions(coordsToProject.dotProduct(this.right), coordsToProject.dotProduct(this.down), coordsToProject.dotProduct(this.forward));
                return coordsToProject;
            }
            unprojectCoordsRDF(coordsToUnproject) {
                var returnValue = GameFramework.Coords.create();
                var axisScaled = GameFramework.Coords.create();
                for (var i = 0; i < this.axesRDF.length; i++) {
                    var axis = this.axesRDF[i];
                    axisScaled.overwriteWith(axis).multiplyScalar(coordsToUnproject.dimensionGet(i));
                    returnValue.add(axisScaled);
                }
                return coordsToUnproject.overwriteWith(returnValue);
            }
        }
        GameFramework.Orientation = Orientation;
        class Orientation_Instances {
            constructor() {
                this.ForwardXDownZ = new Orientation(new GameFramework.Coords(1, 0, 0), // forward
                new GameFramework.Coords(0, 0, 1) // down
                );
                this.ForwardZDownY = new Orientation(new GameFramework.Coords(0, 0, 1), // forward
                new GameFramework.Coords(0, 1, 0) // down
                );
            }
        }
        GameFramework.Orientation_Instances = Orientation_Instances;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
