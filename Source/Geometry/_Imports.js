"use strict";
// Geometry.
var Camera = gf.Camera;
// Geometry - Collisions.
var Collision = gf.Collision;
var CollisionHelper = gf.CollisionHelper;
var CollisionTrackerBase = gf.CollisionTrackerBase;
var CollisionTrackerMapped = gf.CollisionTrackerMapped;
var CollisionTrackerMappedMap = gf.CollisionTrackerMappedMap;
var CollisionTrackerMappedMapCell = gf.CollisionTrackerMappedMapCell;
var ConstraintBase = gf.ConstraintBase;
var Constraint_AttachToEntityWithId = gf.Constraint_AttachToEntityWithId;
var Constraint_AttachToEntityWithName = gf.Constraint_AttachToEntityWithName;
var Constraint_Conditional = gf.Constraint_Conditional;
var Constraint_ContainInBox = gf.Constraint_ContainInBox;
var Constraint_ContainInHemispace = gf.Constraint_ContainInHemispace;
var Constraint_Dynamic = gf.Constraint_Dynamic;
var Constraint_FrictionDry = gf.Constraint_FrictionDry;
var Constraint_FrictionXY = gf.Constraint_FrictionXY;
var Constraint_FrictionY = gf.Constraint_FrictionY;
var Constraint_Gravity = gf.Constraint_Gravity;
var Constraint_Movable = gf.Constraint_Movable;
var Constraint_Multiple = gf.Constraint_Multiple;
var Constraint_OrientTowardEntityWithName = gf.Constraint_OrientTowardEntityWithName;
var Constraint_OrientationRound = gf.Constraint_OrientationRound;
var Constraint_StopBelowSpeedMin = gf.Constraint_StopBelowSpeedMin;
var Constraint_Transform = gf.Constraint_Transform;
var Constraint_TrimToPlaceSize = gf.Constraint_TrimToPlaceSize;
var Constraint_WrapToPlaceSize = gf.Constraint_WrapToPlaceSize;
var Constraint_WrapToPlaceSizeX = gf.Constraint_WrapToPlaceSizeX;
var Constraint_WrapToPlaceSizeXTrimY = gf.Constraint_WrapToPlaceSizeXTrimY;
// Geometry - Network.
var Network = gf.Network;
var MapCellCollidable = gf.MapCellCollidable;
var MapLocated = gf.MapLocated;
var MapOfCells = gf.MapOfCells;
var MapOfCellsCellSourceArray = gf.MapOfCellsCellSourceArray;
// Geometry - Shapes - Maze.
var Maze = gf.Maze;
var MazeCell = gf.MazeCell;
var MazeCellNetwork = gf.MazeCellNetwork;
// Geometry - Shapes - Meshes.
var MeshBuilder = gf.MeshBuilder;
var MeshTextured = gf.MeshTextured;
// Geometry - Transforms.
var Transform_Camera = gf.Transform_Camera;
// Geometry - Transforms - Bones.
var BoneInfluence = gf.BoneInfluence;
var SkeletonHelper = gf.SkeletonHelper;
var Transform_MeshPoseWithSkeleton = gf.Transform_MeshPoseWithSkeleton;
