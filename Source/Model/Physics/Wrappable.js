"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Wrappable extends GameFramework.EntityPropertyBase {
            constructor(sizeInWrappedInstances, constraintWrap) {
                super();
                this.sizeInWrappedInstances = sizeInWrappedInstances;
                this.constraintWrap = constraintWrap;
                this.initializationIsComplete = false;
            }
            static fromSizeInWrappedInstancesAndConstraintWrap(sizeInWrappedInstances, constraintWrap) {
                return new Wrappable(sizeInWrappedInstances, constraintWrap);
            }
            initialize(uwpe) {
                if (this.initializationIsComplete == false) {
                    var place = uwpe.place;
                    var entity = uwpe.entity;
                    var collidable = GameFramework.Collidable.of(entity);
                    if (collidable != null) {
                        var colliderAtRest = collidable.colliderAtRest;
                        var placeSizeToWrapTo = place.size();
                        colliderAtRest = GameFramework.ShapeWrapped.fromSizeInWrappedInstancesSizeToWrapToAndChild(this.sizeInWrappedInstances, placeSizeToWrapTo, colliderAtRest);
                        collidable.colliderAtRestSet(colliderAtRest);
                    }
                    var constrainable = GameFramework.Constrainable.of(entity);
                    if (constrainable != null) {
                        constrainable.constraintAdd(this.constraintWrap);
                    }
                    var drawable = GameFramework.Drawable.of(entity);
                    if (drawable != null) {
                        var visual = drawable.visual;
                        visual = GameFramework.VisualWrapped.fromSizeInWrappedInstancesAndChild(this.sizeInWrappedInstances, visual);
                        drawable.visualSet(visual);
                    }
                    this.initializationIsComplete = true;
                }
            }
            // Clonable.
            clone() {
                return new Wrappable(this.sizeInWrappedInstances, this.constraintWrap);
            }
        }
        GameFramework.Wrappable = Wrappable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
