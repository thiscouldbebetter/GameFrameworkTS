"use strict";

// Classes from the framework must be imported here
// so that they can be referenced without using the namespace.

import gf = ThisCouldBeBetter.GameFramework;

// hack
// These classes currently have to come first.
import RandomizerLCG = gf.RandomizerLCG;

// Helpers.
import ArrayHelper = gf.ArrayHelper;
import ByteHelper = gf.ByteHelper;
import NumberHelper = gf.NumberHelper;
import StringHelper = gf.StringHelper;

// Entity.
import Entity = gf.Entity;
import EntityProperty = gf.EntityProperty;

// Controls.
import ControlActionNames = gf.ControlActionNames;
import ControlBase = gf.ControlBase;
import ControlBuilder = gf.ControlBuilder;
import ControlButton = gf.ControlButton;
import ControlContainer = gf.ControlContainer;
import ControlContainerTransparent = gf.ControlContainerTransparent;
import ControlLabel = gf.ControlLabel;
import ControlList = gf.ControlList;
import ControlNone = gf.ControlNone;
import ControlScrollbar = gf.ControlScrollbar;
import ControlSelect = gf.ControlSelect;
import ControlSelectOption = gf.ControlSelectOption;
import ControlStyle = gf.ControlStyle;
import ControlTextBox = gf.ControlTextBox;
import ControlTextarea = gf.ControlTextarea;
import ControlVisual = gf.ControlVisual;
import Controllable = gf.Controllable;
import DataBinding = gf.DataBinding;
import VenueControls = gf.VenueControls;
import VenueMessage = gf.VenueMessage;

// Display.
import Color = gf.Color;
import Drawable = gf.Drawable;
import Display = gf.Display;
import Display2D = gf.Display2D;
import DisplayRecorder = gf.DisplayRecorder;
import VenueFader = gf.VenueFader;
import VenueLayered = gf.VenueLayered;
import Visual = gf.Visual;

// Display - Visuals.

import VisualGroup = gf.VisualGroup;
import VisualImageFromLibrary = gf.VisualImageFromLibrary;
import VisualImageScaled = gf.VisualImageScaled;
import VisualNone = gf.VisualNone;

// Display - Visuals - Animation.

// Geometry.
import Camera = gf.Camera;
import Collision = gf.Collision;
import CollisionHelper = gf.CollisionHelper;
import CollisionTracker = gf.CollisionTracker;
import Coords = gf.Coords;
import Direction = gf.Direction;
import Disposition = gf.Disposition;
import Orientation = gf.Orientation;
import Polar = gf.Polar;
import RangeExtent = gf.RangeExtent;
import Rotation = gf.Rotation;

// Geometry - Constraints.

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
import Plane = gf.Plane;
import Ray = gf.Ray;
import ShapeBase = gf.ShapeBase;
import ShapeContainer = gf.ShapeContainer;
import ShapeGroupAll = gf.ShapeGroupAll;
import ShapeGroupAny = gf.ShapeGroupAny;
import ShapeInverse = gf.ShapeInverse;
import Shell = gf.Shell;
import Sphere = gf.Sphere;
import Wedge = gf.Wedge;

// Geometry - Shapes - Map.
import MapCell = gf.MapCell;
import MapLocated = gf.MapLocated;
import MapOfCells = gf.MapOfCells;

// Geometry - Shapes - Meshes.
import Mesh = gf.Mesh;

// Geometry - Transforms.
import Transform = gf.Transform;
import Transform_Dynamic = gf.Transform_Dynamic;
import Transform_Locate = gf.Transform_Locate;
import Transform_Multiple = gf.Transform_Multiple;
import Transform_Orient = gf.Transform_Orient;
import Transform_Rotate2D = gf.Transform_Rotate2D;
import Transform_RotateRight = gf.Transform_RotateRight;
import Transform_Scale = gf.Transform_Scale;
import Transform_Translate = gf.Transform_Translate;
import Transformable = gf.Transformable;
import Transforms = gf.Transforms;

// Input.
import ActionToInputsMapping = gf.ActionToInputsMapping;
import Input = gf.Input;
import InputHelper = gf.InputHelper;
import UserInputListener = gf.UserInputListener;

// Media.
import Audible = gf.Audible;
import Font = gf.Font;
import Image2 = gf.Image2;  // Name conflicts with a built-in class.
import MediaLibrary = gf.MediaLibrary;
import Sound = gf.Sound;
import SoundHelper = gf.SoundHelper;
import SoundHelperLive = gf.SoundHelperLive;
import TextString = gf.TextString;
import VenueVideo = gf.VenueVideo;
import Video = gf.Video;
import VideoHelper = gf.VideoHelper;
import VisualSound = gf.VisualSound;

// Model.
import EntityBuilder = gf.EntityBuilder;
import EntityGenerator = gf.EntityGenerator;
import Loadable = gf.Loadable;
import Namable = gf.Namable;
import Playable = gf.Playable;
import Selector = gf.Selector;
import Universe = gf.Universe;
import UniverseWorldPlaceEntities = gf.UniverseWorldPlaceEntities;
import Venue = gf.Venue;
import VenueWorld = gf.VenueWorld;
import World = gf.World;
import WorldCreator = gf.WorldCreator;
import WorldDefn = gf.WorldDefn;

// Model - Actors.
import Action = gf.Action;
import Activity = gf.Activity;
import ActivityDefn = gf.ActivityDefn;
import Actor = gf.Actor;

// Model - Combat.
import Armor = gf.Armor;
import Damage = gf.Damage;
import DamageType = gf.DamageType;
import Damager = gf.Damager;
import Enemy = gf.Enemy;
import Killable = gf.Killable;
import Weapon = gf.Weapon;

// Model - Effects.
import Effect = gf.Effect;
import Effectable = gf.Effectable;

// Model - Items.
import Item = gf.Item;
import ItemBarterer = gf.ItemBarterer;
import ItemContainer = gf.ItemContainer;
import ItemDefn = gf.ItemDefn;
import ItemHolder = gf.ItemHolder;
import ItemStore = gf.ItemStore;

// Model - Items - Crafting.

// Model - Items - Equipment.

// Model - Journal.

// Model - Maps.
import Terrain = gf.Terrain;

// Model - Mortality.

// Model - Perception.

// Model - Physics.
import Boundable = gf.Boundable;
import Collidable = gf.Collidable;
import Constrainable = gf.Constrainable;
import Locatable = gf.Locatable;
import Movable = gf.Movable;
import Obstacle = gf.Obstacle;
import Portal = gf.Portal;
import Traversable = gf.Traversable;

// Model - Places.
import Place = gf.Place;
import PlaceBase = gf.PlaceBase;
import PlaceDefn = gf.PlaceDefn;
import PlaceZoned = gf.PlaceZoned;
import Zone = gf.Zone;

// Model - Skills.

// Model - Talk.

// Model - Routable.
import Routable = gf.Routable;
import Route = gf.Route;
import RouteNode = gf.RouteNode;

// Model - Time.

// Model - Usables.

// Profiles.
import Profile = gf.Profile;

// Storage.
import FileHelper = gf.FileHelper;
import Serializer = gf.Serializer;
import StorageHelper = gf.StorageHelper;
import VenueFileUpload = gf.VenueFileUpload;

// Storage - Compressor.
import BitStream = gf.BitStream;
import ByteStreamFromBytes = gf.ByteStreamFromBytes;
import ByteStreamFromString = gf.ByteStreamFromString;
import CompressorLZW = gf.CompressorLZW;

// Storage - TarFile.
var TarFile = gf.TarFile;
var TarFileEntry = gf.TarFileEntry;
var TarFileEntryHeader = gf.TarFileEntryHeader;
var TarFileTypeFlag = gf.TarFileTypeFlag;

// Utility.
import DateTime = gf.DateTime;
import IDHelper = gf.IDHelper;
import PlatformHelper = gf.PlatformHelper;
import Randomizer = gf.Randomizer;
import RandomizerSystem = gf.RandomizerSystem;
import Reference = gf.Reference;
import Stack = gf.Stack;
import TimerHelper = gf.TimerHelper;
import URLParser = gf.URLParser;
import ValueBreak = gf.ValueBreak;
import ValueBreakGroup = gf.ValueBreakGroup;
import VenueTask = gf.VenueTask;