"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SkeletonHelper {
            static biped(heightInPixels) {
                var heightOver2 = heightInPixels / 2;
                var heightOfSpine = heightInPixels / 2.4;
                var heightOver4 = heightInPixels / 4;
                var heightOver6 = heightInPixels / 6;
                var heightOver8 = heightInPixels / 8;
                var heightOver9 = heightInPixels / 9;
                var heightOver12 = heightInPixels / 12;
                var heightOver18 = heightInPixels / 18;
                var isVisibleTrue = true;
                var legRight = new GameFramework.Bone("Hip.R", heightOver12, new GameFramework.Orientation(new GameFramework.Coords(-1, 0, 0), new GameFramework.Coords(0, 0, 1)), [
                    new GameFramework.Bone("Thigh.R", heightOver4, new GameFramework.Orientation(new GameFramework.Coords(0, 0, 1), new GameFramework.Coords(-1, 0, 0)), [
                        new GameFramework.Bone("Shin.R", heightOver4, new GameFramework.Orientation(new GameFramework.Coords(0, 0, 1), new GameFramework.Coords(1, 0, 0)), [
                            new GameFramework.Bone("Foot.R", heightOver8, new GameFramework.Orientation(new GameFramework.Coords(0, 1, 0), new GameFramework.Coords(1, 0, 0)), [], isVisibleTrue)
                        ], isVisibleTrue),
                    ], isVisibleTrue)
                ], isVisibleTrue);
                var legLeft = new GameFramework.Bone("Hip.L", heightOver12, new GameFramework.Orientation(new GameFramework.Coords(1, 0, 0), new GameFramework.Coords(0, 0, 1)), [
                    new GameFramework.Bone("Thigh.L", heightOver4, new GameFramework.Orientation(new GameFramework.Coords(0, 0, 1), new GameFramework.Coords(-1, 0, 0)), [
                        new GameFramework.Bone("Shin.L", heightOver4, new GameFramework.Orientation(new GameFramework.Coords(0, 0, 1), new GameFramework.Coords(1, 0, 0)), [
                            new GameFramework.Bone("Foot.L", heightOver8, new GameFramework.Orientation(new GameFramework.Coords(0, 1, 0), new GameFramework.Coords(1, 0, 0)), [], isVisibleTrue)
                        ], isVisibleTrue),
                    ], isVisibleTrue)
                ], isVisibleTrue);
                var upperEntity = new GameFramework.Bone("Spine.1", heightOfSpine, new GameFramework.Orientation(new GameFramework.Coords(0, 0, -1), new GameFramework.Coords(0, -1, 0)), [
                    new GameFramework.Bone("Neck", heightOver12, new GameFramework.Orientation(new GameFramework.Coords(0, 0, -1), new GameFramework.Coords(0, 1, 0)), [
                        new GameFramework.Bone("Head.Back", heightOver18, new GameFramework.Orientation(new GameFramework.Coords(0, 0, -1), new GameFramework.Coords(0, 1, 0)), [
                            new GameFramework.Bone("Head.Front", heightOver9, new GameFramework.Orientation(new GameFramework.Coords(0, 1, 0), new GameFramework.Coords(0, 0, 1)), [], isVisibleTrue),
                        ], isVisibleTrue)
                    ], isVisibleTrue),
                    new GameFramework.Bone("Shoulder.L", heightOver6, new GameFramework.Orientation(new GameFramework.Coords(1, 0, 0), new GameFramework.Coords(0, 0, 1)), [
                        new GameFramework.Bone("Bicep.L", heightOver6, new GameFramework.Orientation(new GameFramework.Coords(0, -.1, 1), new GameFramework.Coords(-1, 0, 0)), [
                            new GameFramework.Bone("Forearm.L", heightOver6, new GameFramework.Orientation(new GameFramework.Coords(0, .1, 1), new GameFramework.Coords(-1, 0, 0)), [], isVisibleTrue)
                        ], isVisibleTrue)
                    ], isVisibleTrue),
                    new GameFramework.Bone("Shoulder.R", heightOver6, new GameFramework.Orientation(new GameFramework.Coords(-1, 0, 0), new GameFramework.Coords(0, 0, 1)), [
                        new GameFramework.Bone("Bicep.R", heightOver6, new GameFramework.Orientation(new GameFramework.Coords(0, -.1, 1), new GameFramework.Coords(-1, 0, 0)), [
                            new GameFramework.Bone("Forearm.R", heightOver6, new GameFramework.Orientation(new GameFramework.Coords(0, .1, 1), new GameFramework.Coords(-1, 0, 0)), [], isVisibleTrue)
                        ], isVisibleTrue)
                    ], isVisibleTrue)
                ], isVisibleTrue); // end spine
                var skeletonBiped = new GameFramework.Skeleton("Skeleton0", new GameFramework.Bone("Root", heightOver2, new GameFramework.Orientation(new GameFramework.Coords(0, 0, -1), new GameFramework.Coords(0, 1, 0)), [
                    legRight,
                    legLeft,
                    upperEntity,
                ], false // isVisible - hide the root bone
                ));
                /*
                skeletonBiped.transform(new Transform_DimensionsSwap([0, 1]));
                skeletonBiped.transform(new Transform_Scale(new Coords(-1, -1, 1)));
                */
                skeletonBiped.transform(new GameFramework.Transform_Orient(new GameFramework.Orientation(new GameFramework.Coords(0, 1, 0), new GameFramework.Coords(0, 0, 1))));
                return skeletonBiped;
            }
            static bipedAnimationDefnGroup() {
                var returnValue = new GameFramework.AnimationDefnGroup("Biped", [
                    SkeletonHelper.bipedAnimationDefnDoSomething(),
                    SkeletonHelper.bipedAnimationDefnJump(),
                    SkeletonHelper.bipedAnimationDefnWalk(),
                ]);
                return returnValue;
            }
            static bipedAnimationDefnDoSomething() {
                var returnValue = new GameFramework.AnimationDefn("DoSomething", [
                    new GameFramework.AnimationKeyframe(0, new Array(new GameFramework.Transform_BonePose("Forearm.L", [.25]), new GameFramework.Transform_BonePose("Bicep.L", [.25, 0, -.25]), new GameFramework.Transform_BonePose("Forearm.R", [.25]), new GameFramework.Transform_BonePose("Bicep.R", [.25, 0, .25]))),
                    new GameFramework.AnimationKeyframe(1, new Array(new GameFramework.Transform_BonePose("Forearm.L", [.25]), new GameFramework.Transform_BonePose("Bicep.L", [.25, 0, .25]), new GameFramework.Transform_BonePose("Forearm.R", [.25]), new GameFramework.Transform_BonePose("Bicep.R", [.25, 0, -.25]))),
                ]);
                return returnValue;
            }
            static bipedAnimationDefnJump() {
                var returnValue = new GameFramework.AnimationDefn("Jump", [
                    new GameFramework.AnimationKeyframe(0, new Array(new GameFramework.Transform_BonePose("Thigh.L", [.25]), new GameFramework.Transform_BonePose("Shin.L", [.25]), new GameFramework.Transform_BonePose("Thigh.R", [.25]), new GameFramework.Transform_BonePose("Shin.R", [.25]))),
                    new GameFramework.AnimationKeyframe(1, new Array(new GameFramework.Transform_BonePose("Thigh.L", [.25]), new GameFramework.Transform_BonePose("Shin.L", [.25]), new GameFramework.Transform_BonePose("Thigh.R", [.25]), new GameFramework.Transform_BonePose("Shin.R", [.25]))),
                ]);
                return returnValue;
            }
            static bipedAnimationDefnWalk() {
                var animationDefnBipedWalk = new GameFramework.AnimationDefn("Walk", [
                    new GameFramework.AnimationKeyframe(0, new Array(new GameFramework.Transform_BonePose("Bicep.L", [-.1]), new GameFramework.Transform_BonePose("Forearm.L", [0]), new GameFramework.Transform_BonePose("Thigh.L", [.1]), new GameFramework.Transform_BonePose("Shin.L", [0]), new GameFramework.Transform_BonePose("Bicep.R", [.1]), new GameFramework.Transform_BonePose("Forearm.R", [.1]), new GameFramework.Transform_BonePose("Thigh.R", [-.05]), new GameFramework.Transform_BonePose("Shin.R", [0]))),
                    new GameFramework.AnimationKeyframe(5, new Array(new GameFramework.Transform_BonePose("Thigh.L", [.1]), new GameFramework.Transform_BonePose("Shin.L", [.1]), new GameFramework.Transform_BonePose("Thigh.R", [-.1]), new GameFramework.Transform_BonePose("Shin.R", [0]))),
                    new GameFramework.AnimationKeyframe(10, new Array(new GameFramework.Transform_BonePose("Thigh.L", [0]), new GameFramework.Transform_BonePose("Shin.L", [0]), new GameFramework.Transform_BonePose("Thigh.R", [0]), new GameFramework.Transform_BonePose("Shin.R", [.1]))),
                    new GameFramework.AnimationKeyframe(15, new Array(new GameFramework.Transform_BonePose("Bicep.L", [.1]), new GameFramework.Transform_BonePose("Forearm.L", [.1]), new GameFramework.Transform_BonePose("Thigh.L", [-.05]), new GameFramework.Transform_BonePose("Bicep.R", [-.1]), new GameFramework.Transform_BonePose("Forearm.R", [0]), new GameFramework.Transform_BonePose("Thigh.R", [.1]), new GameFramework.Transform_BonePose("Shin.R", [0]))),
                    new GameFramework.AnimationKeyframe(20, new Array(new GameFramework.Transform_BonePose("Thigh.L", [-.1]), new GameFramework.Transform_BonePose("Shin.L", [0]), new GameFramework.Transform_BonePose("Thigh.R", [.1]), new GameFramework.Transform_BonePose("Shin.R", [.1]))),
                    new GameFramework.AnimationKeyframe(25, new Array(new GameFramework.Transform_BonePose("Thigh.L", [0]), new GameFramework.Transform_BonePose("Shin.L", [.1]), new GameFramework.Transform_BonePose("Thigh.R", [0]), new GameFramework.Transform_BonePose("Shin.R", [0]))),
                    new GameFramework.AnimationKeyframe(30, new Array(new GameFramework.Transform_BonePose("Bicep.L", [-.1]), new GameFramework.Transform_BonePose("Forearm.L", [0]), new GameFramework.Transform_BonePose("Thigh.L", [.1]), new GameFramework.Transform_BonePose("Shin.L", [0]), new GameFramework.Transform_BonePose("Bicep.R", [.1]), new GameFramework.Transform_BonePose("Forearm.R", [.1]), new GameFramework.Transform_BonePose("Thigh.R", [-.05]), new GameFramework.Transform_BonePose("Shin.R", [0]))),
                ]);
                return animationDefnBipedWalk;
            }
            static transformBuildForMeshAndSkeleton_Proximity(meshAtRest, skeletonAtRest, skeletonPosed) {
                var vertices = meshAtRest.geometry.vertices();
                var bones = skeletonAtRest.bonesAll;
                var boneInfluences = new Array();
                var boneNameToInfluenceLookup = {};
                for (var v = 0; v < vertices.length; v++) {
                    var vertex = vertices[v];
                    var distanceLeastSoFar = Number.POSITIVE_INFINITY;
                    var indexOfBoneClosestSoFar = null;
                    for (var b = 0; b < bones.length; b++) {
                        var bone = bones[b];
                        var displacement = vertex.clone().subtract(bone.pos(bones).add(bone.orientation.forward.clone().multiplyScalar(bone.length)));
                        var distance = displacement.magnitude();
                        if (distance < distanceLeastSoFar) {
                            distanceLeastSoFar = distance;
                            indexOfBoneClosestSoFar = b;
                        }
                    }
                    var boneClosest = bones[indexOfBoneClosestSoFar];
                    var boneClosestName = boneClosest.name;
                    var boneInfluence = boneNameToInfluenceLookup[boneClosestName];
                    if (boneInfluence == null) {
                        boneInfluence = new GameFramework.BoneInfluence(boneClosestName, new Array());
                        boneNameToInfluenceLookup[boneClosestName] = boneInfluence;
                        boneInfluences.push(boneInfluence);
                    }
                    boneInfluence.vertexIndicesControlled.push(v);
                }
                var returnValue = new GameFramework.Transform_MeshPoseWithSkeleton(meshAtRest, skeletonAtRest, boneInfluences, skeletonPosed);
                return returnValue;
            }
        }
        GameFramework.SkeletonHelper = SkeletonHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
