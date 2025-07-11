"use strict";

// Geometry.
import Camera = gf.Camera;
import Coords = gf.Coords;
import Direction = gf.Direction;
import Disposition = gf.Disposition;
import Orientation = gf.Orientation;
import Polar = gf.Polar;
import RangeExtent = gf.RangeExtent;
import Rotation = gf.Rotation;

// Geometry - Collisions.
import Collision = gf.Collision;
import CollisionHelper = gf.CollisionHelper;
import CollisionTracker = gf.CollisionTracker;
import CollisionTrackerBase = gf.CollisionTrackerBase;
import CollisionTrackerMapped = gf.CollisionTrackerMapped;
import CollisionTrackerMappedMap = gf.CollisionTrackerMappedMap;
import CollisionTrackerMappedMapCell = gf.CollisionTrackerMappedMapCell;

// Geometry - Constraints.
import Constraint_AttachToEntityWithId = gf.Constraint_AttachToEntityWithId;
import Constraint_AttachToEntityWithName = gf.Constraint_AttachToEntityWithName;
import Constraint_Conditional = gf.Constraint_Conditional;
import Constraint_ContainInBox = gf.Constraint_ContainInBox;
import Constraint_ContainInHemispace = gf.Constraint_ContainInHemispace;
import Constraint_FrictionDry = gf.Constraint_FrictionDry;
import Constraint_FrictionXY = gf.Constraint_FrictionXY;
import Constraint_Gravity = gf.Constraint_Gravity;
import Constraint_Multiple = gf.Constraint_Multiple;
import Constraint_OrientTowardEntityWithName = gf.Constraint_OrientTowardEntityWithName;
import Constraint_SpeedMaxXY = gf.Constraint_SpeedMaxXY;
import Constraint_StopBelowSpeedMin = gf.Constraint_StopBelowSpeedMin;
import Constraint_Transform = gf.Constraint_Transform;
import Constraint_TrimToPlaceSize = gf.Constraint_TrimToPlaceSize;
import Constraint_WrapToPlaceSize = gf.Constraint_WrapToPlaceSize;
import Constraint_WrapToPlaceSizeX = gf.Constraint_WrapToPlaceSizeX;
import Constraint_WrapToPlaceSizeXTrimY = gf.Constraint_WrapToPlaceSizeXTrimY;

// Geometry - Network.
import Network = gf.Network;

// Geometry - Shapes.
import Arc = gf.Arc;
import Box = gf.Box;
import BoxRotated = gf.BoxRotated;
import Cylinder = gf.Cylinder;
import Edge = gf.Edge;
import Face = gf.Face;
import Hemispace = gf.Hemispace;
import Path = gf.Path;
import PathBuilder = gf.PathBuilder;
import Plane = gf.Plane;
import Point = gf.Point;
import Ray = gf.Ray;
import ShapeBase = gf.ShapeBase;
import ShapeContainer = gf.ShapeContainer;
import ShapeGroupAll = gf.ShapeGroupAll;
import ShapeGroupAny = gf.ShapeGroupAny;
import ShapeInverse = gf.ShapeInverse;
import ShapeTransformed = gf.ShapeTransformed;
import Shell = gf.Shell;
import Sphere = gf.Sphere;
import Wedge = gf.Wedge;

// Geometry - Shapes - Map.
import MapCell = gf.MapCell;
import MapCellCollidable = gf.MapCellCollidable;
import MapLocated = gf.MapLocated;
import MapOfCells = gf.MapOfCells;
import MapOfCellsCellSource = gf.MapOfCellsCellSource;
import MapOfCellsCellSourceArray = gf.MapOfCellsCellSourceArray;

// Geometry - Shapes - Meshes.
import Mesh = gf.Mesh;
import MeshTextured = gf.MeshTextured;

// Geometry - Transforms.
import Transform = gf.Transform;
import TransformBase = gf.TransformBase;
import Transform_Dynamic = gf.Transform_Dynamic;
import Transform_Locate = gf.Transform_Locate;
import Transform_Multiple = gf.Transform_Multiple;
import Transform_Orient = gf.Transform_Orient;
import Transform_Rotate2D = gf.Transform_Rotate2D;
import Transform_RotateRight = gf.Transform_RotateRight;
import Transform_Scale = gf.Transform_Scale;
import Transform_Translate = gf.Transform_Translate;
import Transformable = gf.Transformable;
import TransformableBase = gf.TransformableBase;
import Transforms = gf.Transforms;
