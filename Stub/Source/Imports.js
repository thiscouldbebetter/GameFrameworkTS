"use strict";
// Classes from the framework must be imported here
// so that they can be referenced without using the namespace.
var gf = ThisCouldBeBetter.GameFramework;
// hack
// These classes currently have to come first.
var RandomizerLCG = gf.RandomizerLCG;
// Helpers.
var ArrayHelper = gf.ArrayHelper;
var ByteHelper = gf.ByteHelper;
var NumberHelper = gf.NumberHelper;
var StringHelper = gf.StringHelper;
// Entity.
var Entity = gf.Entity;
// Controls.
var ControlActionNames = gf.ControlActionNames;
var ControlBase = gf.ControlBase;
var ControlBuilder = gf.ControlBuilder;
var ControlButton = gf.ControlButton;
var ControlContainer = gf.ControlContainer;
var ControlContainerTransparent = gf.ControlContainerTransparent;
var ControlLabel = gf.ControlLabel;
var ControlList = gf.ControlList;
var ControlNone = gf.ControlNone;
var ControlScrollbar = gf.ControlScrollbar;
var ControlSelect = gf.ControlSelect;
var ControlSelectOption = gf.ControlSelectOption;
var ControlStyle = gf.ControlStyle;
var ControlTextBox = gf.ControlTextBox;
var ControlTextarea = gf.ControlTextarea;
var ControlVisual = gf.ControlVisual;
var Controllable = gf.Controllable;
var DataBinding = gf.DataBinding;
var VenueControls = gf.VenueControls;
var VenueMessage = gf.VenueMessage;
// Display.
var Color = gf.Color;
var Drawable = gf.Drawable;
var Display2D = gf.Display2D;
var DisplayRecorder = gf.DisplayRecorder;
var VenueFader = gf.VenueFader;
var VenueLayered = gf.VenueLayered;
// Display - Visuals.
var VisualGroup = gf.VisualGroup;
var VisualImageFromLibrary = gf.VisualImageFromLibrary;
var VisualImageScaled = gf.VisualImageScaled;
var VisualNone = gf.VisualNone;
// Display - Visuals - Animation.
// Geometry.
var Camera = gf.Camera;
var Collision = gf.Collision;
var CollisionHelper = gf.CollisionHelper;
var CollisionTracker = gf.CollisionTracker;
var Coords = gf.Coords;
var Direction = gf.Direction;
var Disposition = gf.Disposition;
var Orientation = gf.Orientation;
var Polar = gf.Polar;
var RangeExtent = gf.RangeExtent;
var Rotation = gf.Rotation;
// Geometry - Constraints.
// Geometry - Network.
var Network = gf.Network;
// Geometry - Shapes.
var Arc = gf.Arc;
var Box = gf.Box;
var BoxRotated = gf.BoxRotated;
var Cylinder = gf.Cylinder;
var Edge = gf.Edge;
var Face = gf.Face;
var Hemispace = gf.Hemispace;
var Plane = gf.Plane;
var Ray = gf.Ray;
var ShapeContainer = gf.ShapeContainer;
var ShapeGroupAll = gf.ShapeGroupAll;
var ShapeGroupAny = gf.ShapeGroupAny;
var ShapeInverse = gf.ShapeInverse;
var Shell = gf.Shell;
var Sphere = gf.Sphere;
var Wedge = gf.Wedge;
// Geometry - Shapes - Map.
var MapCell = gf.MapCell;
var MapLocated = gf.MapLocated;
var MapOfCells = gf.MapOfCells;
// Geometry - Shapes - Meshes.
var Mesh = gf.Mesh;
var Transform_Dynamic = gf.Transform_Dynamic;
var Transform_Locate = gf.Transform_Locate;
var Transform_Multiple = gf.Transform_Multiple;
var Transform_Orient = gf.Transform_Orient;
var Transform_Rotate2D = gf.Transform_Rotate2D;
var Transform_RotateRight = gf.Transform_RotateRight;
var Transform_Scale = gf.Transform_Scale;
var Transform_Translate = gf.Transform_Translate;
var Transforms = gf.Transforms;
// Input.
var ActionToInputsMapping = gf.ActionToInputsMapping;
var Input = gf.Input;
var InputHelper = gf.InputHelper;
var UserInputListener = gf.UserInputListener;
// Media.
var Audible = gf.Audible;
var Font = gf.Font;
var Image2 = gf.Image2; // Name conflicts with a built-in class.
var MediaLibrary = gf.MediaLibrary;
var Sound = gf.Sound;
var SoundHelper = gf.SoundHelper;
var TextString = gf.TextString;
var VenueVideo = gf.VenueVideo;
var Video = gf.Video;
var VideoHelper = gf.VideoHelper;
var VisualSound = gf.VisualSound;
// Model.
var EntityBuilder = gf.EntityBuilder;
var EntityGenerator = gf.EntityGenerator;
var Loadable = gf.Loadable;
var Playable = gf.Playable;
var Selector = gf.Selector;
var Universe = gf.Universe;
var UniverseWorldPlaceEntities = gf.UniverseWorldPlaceEntities;
var VenueWorld = gf.VenueWorld;
var World = gf.World;
var WorldDefn = gf.WorldDefn;
// Model - Actors.
var Action = gf.Action;
var Activity = gf.Activity;
var ActivityDefn = gf.ActivityDefn;
var Actor = gf.Actor;
// Model - Combat.
var Armor = gf.Armor;
var Damage = gf.Damage;
var DamageType = gf.DamageType;
var Damager = gf.Damager;
var Enemy = gf.Enemy;
var Killable = gf.Killable;
var Weapon = gf.Weapon;
// Model - Effects.
var Effect = gf.Effect;
var Effectable = gf.Effectable;
// Model - Items.
var Item = gf.Item;
var ItemBarterer = gf.ItemBarterer;
var ItemContainer = gf.ItemContainer;
var ItemDefn = gf.ItemDefn;
var ItemHolder = gf.ItemHolder;
var ItemStore = gf.ItemStore;
// Model - Items - Crafting.
// Model - Items - Equipment.
// Model - Journal.
// Model - Maps.
var Terrain = gf.Terrain;
// Model - Mortality.
// Model - Perception.
// Model - Physics.
var Boundable = gf.Boundable;
var Collidable = gf.Collidable;
var Constrainable = gf.Constrainable;
var Locatable = gf.Locatable;
var Movable = gf.Movable;
var Obstacle = gf.Obstacle;
var Portal = gf.Portal;
var Traversable = gf.Traversable;
// Model - Places.
var Place = gf.Place;
var PlaceDefn = gf.PlaceDefn;
var PlaceZoned = gf.PlaceZoned;
var Zone = gf.Zone;
// Model - Skills.
// Model - Talk.
// Model - Routable.
var Routable = gf.Routable;
var Route = gf.Route;
var RouteNode = gf.RouteNode;
// Model - Time.
// Model - Usables.
// Profiles.
var Profile = gf.Profile;
// Storage.
var FileHelper = gf.FileHelper;
var Serializer = gf.Serializer;
var StorageHelper = gf.StorageHelper;
var VenueFileUpload = gf.VenueFileUpload;
// Storage - Compressor.
var BitStream = gf.BitStream;
var ByteStreamFromBytes = gf.ByteStreamFromBytes;
var ByteStreamFromString = gf.ByteStreamFromString;
var CompressorLZW = gf.CompressorLZW;
// Storage - TarFile.
var TarFile = gf.TarFile;
var TarFileEntry = gf.TarFileEntry;
var TarFileEntryHeader = gf.TarFileEntryHeader;
var TarFileTypeFlag = gf.TarFileTypeFlag;
// Utility.
var DateTime = gf.DateTime;
var IDHelper = gf.IDHelper;
var PlatformHelper = gf.PlatformHelper;
var RandomizerSystem = gf.RandomizerSystem;
var Reference = gf.Reference;
var TimerHelper = gf.TimerHelper;
var URLParser = gf.URLParser;
var ValueBreak = gf.ValueBreak;
var ValueBreakGroup = gf.ValueBreakGroup;
var VenueTask = gf.VenueTask;
