"use strict";

// Classes from the framework must be imported here
// so that they can be referenced without using the namespace.

import gf = ThisCouldBeBetter.GameFramework;

// hack
// These classes currently have to come first.
import RandomizerLCG = gf.RandomizerLCG;

// Helpers.
import ArrayHelper = gf.ArrayHelper;
import NumberHelper = gf.NumberHelper;
import StringHelper = gf.StringHelper;

// hack
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
import VisualAnchor = gf.VisualAnchor;
import VisualArc = gf.VisualArc;
import VisualBar = gf.VisualBar;
import VisualBuffered = gf.VisualBuffered;
import VisualBuilder = gf.VisualBuilder;
import VisualCircle = gf.VisualCircle;
import VisualCircleGradient = gf.VisualCircleGradient;
import VisualDirectional = gf.VisualDirectional;
import VisualDynamic = gf.VisualDynamic;
import VisualEllipse = gf.VisualEllipse;
import VisualErase = gf.VisualErase;
import VisualGroup = gf.VisualGroup;
import VisualImage = gf.VisualImage;
import VisualImageMock = gf.VisualImageMock;
import VisualImageFromLibrary = gf.VisualImageFromLibrary;
import VisualImageImmediate = gf.VisualImageImmediate;
import VisualImageScaled = gf.VisualImageScaled;
import VisualImageScaledPartial = gf.VisualImageScaledPartial;
import VisualJump2D = gf.VisualJump2D;
import VisualLine = gf.VisualLine;
import VisualMap = gf.VisualMap;
import VisualNone = gf.VisualNone;
import VisualOffset = gf.VisualOffset;
import VisualParticles = gf.VisualParticles;
import VisualPath = gf.VisualPath;
import VisualPolars = gf.VisualPolars;
import VisualPolygon = gf.VisualPolygon;
import VisualRectangle = gf.VisualRectangle;
import VisualRepeating = gf.VisualRepeating;
import VisualRotate = gf.VisualRotate;
import VisualSelect = gf.VisualSelect;
import VisualStack = gf.VisualStack;
import VisualText = gf.VisualText;

// Display - Visuals - Animation.
import Animatable2 = gf.Animatable2; // Possibly conflicts with a built-in class?
import VisualAnimation = gf.VisualAnimation;

// Geometry.
import Camera = gf.Camera;
import Coords = gf.Coords;
import Direction = gf.Direction;
import Disposition = gf.Disposition;
import Orientation = gf.Orientation;
import Polar = gf.Polar;
import RangeExtent = gf.RangeExtent;
import Rotation = gf.Rotation;

// Geometry - Collision.
import Collision = gf.Collision;
import CollisionHelper = gf.CollisionHelper;
import CollisionTracker = gf.CollisionTracker;

// Geometry - Constraints.
import Constraint_AttachToEntityWithId = gf.Constraint_AttachToEntityWithId;
import Constraint_AttachToEntityWithName = gf.Constraint_AttachToEntityWithName;
import Constraint_Conditional = gf.Constraint_Conditional;
import Constraint_ContainInBox = gf.Constraint_ContainInBox;
import Constraint_ContainInHemispace = gf.Constraint_ContainInHemispace;
import Constraint_FrictionDry = gf.Constraint_FrictionDry;
import Constraint_FrictionXY = gf.Constraint_FrictionXY;
import Constraint_Gravity = gf.Constraint_Gravity;
import Constraint_Offset = gf.Constraint_Offset;
import Constraint_OrientToward = gf.Constraint_OrientToward;
import Constraint_SpeedMaxXY = gf.Constraint_SpeedMaxXY;
import Constraint_StopBelowSpeedMin = gf.Constraint_StopBelowSpeedMin;
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
import Font = gf.Font;
import Image2 = gf.Image2;  // Name conflicts with a built-in class.
import MediaLibrary = gf.MediaLibrary;
import TextString = gf.TextString;
import VenueVideo = gf.VenueVideo;
import Video = gf.Video;
import VideoHelper = gf.VideoHelper;

// Media - Audio.
import Sound = gf.Sound;
import SoundHelper = gf.SoundHelper;
import SoundHelperLive = gf.SoundHelperLive;
import VisualSound = gf.VisualSound;

// Model.
import Entity = gf.Entity;
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
import CraftingRecipe = gf.CraftingRecipe;
import ItemCrafter = gf.ItemCrafter;

// Model - Items - Equipment.
import EquipmentSocket = gf.EquipmentSocket;
import EquipmentSocketDefn = gf.EquipmentSocketDefn;
import EquipmentSocketDefnGroup = gf.EquipmentSocketDefnGroup;
import EquipmentUser = gf.EquipmentUser;
import Equippable = gf.Equippable;

// Model - Journal.
import Journal = gf.Journal;
import JournalEntry = gf.JournalEntry;
import JournalKeeper = gf.JournalKeeper;

// Model - Maps.
import Terrain = gf.Terrain;

// Model - Mortality.
import Ephemeral = gf.Ephemeral;
import Phase = gf.Phase;
import Phased = gf.Phased;
import Starvable = gf.Starvable;
import Tirable = gf.Tirable;

// Model - Perception.
import Perceptible = gf.Perceptible;
import Perceptor = gf.Perceptor;

// Model - Physics.
import Boundable = gf.Boundable;
import Collidable = gf.Collidable;
import Constrainable = gf.Constrainable;
import ForceField = gf.ForceField;
import Locatable = gf.Locatable;
import Movable = gf.Movable;
import Obstacle = gf.Obstacle;
import Portal = gf.Portal;
import Traversable = gf.Traversable;
import Vehicle = gf.Vehicle;

// Model - Places.
import Place = gf.Place;
import PlaceDefn = gf.PlaceDefn;
import PlaceZoned = gf.PlaceZoned;
import Zone = gf.Zone;

// Model - Skills.
import Skill = gf.Skill;
import SkillLearner = gf.SkillLearner;

// Model - Talk.
import ConversationDefn = gf.ConversationDefn;
import ConversationRun = gf.ConversationRun;
import ConversationScope = gf.ConversationScope;
import TalkNode = gf.TalkNode;
import TalkNodeDefn = gf.TalkNodeDefn;
import Talker = gf.Talker;
import WordBubble = gf.WordBubble;

// Model - Routable.
import Routable = gf.Routable;
import Route = gf.Route;
import RouteNode = gf.RouteNode;

// Model - Time.
import Idleable = gf.Idleable;
import Recurrent = gf.Recurrent;

// Model - Usables.
import Device = gf.Device;
import Usable = gf.Usable;

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

// Tests.

import Assert = gf.Assert;
import TestFixture = gf.TestFixture;
import TestSuite = gf.TestSuite;

// Utility.
import DateTime = gf.DateTime;
import DiceRoll = gf.DiceRoll;
import IDHelper = gf.IDHelper;
import PlatformHelper = gf.PlatformHelper;
import Randomizer = gf.Randomizer;
import RandomizerSystem = gf.RandomizerSystem;
import Reference = gf.Reference;
import TimerHelper = gf.TimerHelper;
import URLParser = gf.URLParser;
import ValueBreak = gf.ValueBreak;
import ValueBreakGroup = gf.ValueBreakGroup;
import VenueTask = gf.VenueTask;
