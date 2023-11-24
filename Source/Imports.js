"use strict";
// Classes from the framework must be imported here
// so that they can be referenced without using the namespace.
var gf = ThisCouldBeBetter.GameFramework;
// hack
// These classes currently have to come first.
var RandomizerLCG = gf.RandomizerLCG;
// Helpers.
var ArrayHelper = gf.ArrayHelper;
var NumberHelper = gf.NumberHelper;
var StringHelper = gf.StringHelper;
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
var ControlNumber = gf.ControlNumber;
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
var VisualAnchor = gf.VisualAnchor;
var VisualArc = gf.VisualArc;
var VisualBar = gf.VisualBar;
var VisualBuffered = gf.VisualBuffered;
var VisualBuilder = gf.VisualBuilder;
var VisualCircle = gf.VisualCircle;
var VisualCircleGradient = gf.VisualCircleGradient;
var VisualCrosshairs = gf.VisualCrosshairs;
var VisualDeferred = gf.VisualDeferred;
var VisualDirectional = gf.VisualDirectional;
var VisualDynamic = gf.VisualDynamic;
var VisualEllipse = gf.VisualEllipse;
var VisualErase = gf.VisualErase;
var VisualGroup = gf.VisualGroup;
var VisualImageFromLibrary = gf.VisualImageFromLibrary;
var VisualImageImmediate = gf.VisualImageImmediate;
var VisualImageScaled = gf.VisualImageScaled;
var VisualImageScaledPartial = gf.VisualImageScaledPartial;
var VisualJump2D = gf.VisualJump2D;
var VisualLine = gf.VisualLine;
var VisualMap = gf.VisualMap;
var VisualNone = gf.VisualNone;
var VisualOffset = gf.VisualOffset;
var VisualParticles = gf.VisualParticles;
var VisualPath = gf.VisualPath;
var VisualPolars = gf.VisualPolars;
var VisualPolygon = gf.VisualPolygon;
var VisualRectangle = gf.VisualRectangle;
var VisualRepeating = gf.VisualRepeating;
var VisualRotate = gf.VisualRotate;
var VisualSelect = gf.VisualSelect;
var VisualStack = gf.VisualStack;
var VisualText = gf.VisualText;
// Display - Visuals - Animation.
var Animatable2 = gf.Animatable2; // Possibly conflicts with a built-in class?
var VisualAnimation = gf.VisualAnimation;
// Geometry.
var Camera = gf.Camera;
var Coords = gf.Coords;
var Direction = gf.Direction;
var Disposition = gf.Disposition;
var Orientation = gf.Orientation;
var Polar = gf.Polar;
var RangeExtent = gf.RangeExtent;
var Rotation = gf.Rotation;
// Geometry - Collisions.
var Collision = gf.Collision;
var CollisionHelper = gf.CollisionHelper;
var CollisionTracker = gf.CollisionTracker;
var CollisionTrackerMap = gf.CollisionTrackerMap;
var CollisionTrackerMapCell = gf.CollisionTrackerMapCell;
// Geometry - Constraints.
var Constraint_AttachToEntityWithName = gf.Constraint_AttachToEntityWithName;
var Constraint_Conditional = gf.Constraint_Conditional;
var Constraint_ContainInBox = gf.Constraint_ContainInBox;
var Constraint_ContainInHemispace = gf.Constraint_ContainInHemispace;
var Constraint_FrictionDry = gf.Constraint_FrictionDry;
var Constraint_FrictionXY = gf.Constraint_FrictionXY;
var Constraint_Gravity = gf.Constraint_Gravity;
var Constraint_SpeedMaxXY = gf.Constraint_SpeedMaxXY;
var Constraint_TrimToPlaceSize = gf.Constraint_TrimToPlaceSize;
var Constraint_WrapToPlaceSize = gf.Constraint_WrapToPlaceSize;
var Constraint_WrapToPlaceSizeXTrimY = gf.Constraint_WrapToPlaceSizeXTrimY;
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
var Path = gf.Path;
var PathBuilder = gf.PathBuilder;
var Plane = gf.Plane;
var Ray = gf.Ray;
var ShapeContainer = gf.ShapeContainer;
var ShapeGroupAll = gf.ShapeGroupAll;
var ShapeGroupAny = gf.ShapeGroupAny;
var ShapeInverse = gf.ShapeInverse;
var Shell = gf.Shell;
var Sphere = gf.Sphere;
var Wedge = gf.Wedge;
var MapCellCollidable = gf.MapCellCollidable;
var MapLocated = gf.MapLocated;
var MapOfCells = gf.MapOfCells;
var MapOfCellsCellSourceArray = gf.MapOfCellsCellSourceArray;
// Geometry - Shapes - Meshes.
var Mesh = gf.Mesh;
var MeshTextured = gf.MeshTextured;
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
var Font = gf.Font;
var FontNameAndHeight = gf.FontNameAndHeight;
var Image2 = gf.Image2; // Name conflicts with a built-in class.
var ImageBuilder = gf.ImageBuilder;
var MediaLibrary = gf.MediaLibrary;
var TextString = gf.TextString;
var TextStringFromImage = gf.TextStringFromImage;
var VenueVideo = gf.VenueVideo;
var Video = gf.Video;
var VideoHelper = gf.VideoHelper;
// Media - Audio.
var Audible = gf.Audible;
var SoundFromFile = gf.SoundFromFile;
var SoundHelperLive = gf.SoundHelperLive;
var VisualSound = gf.VisualSound;
// Model.
var Entity = gf.Entity;
var EntityBuilder = gf.EntityBuilder;
var EntityGenerator = gf.EntityGenerator;
var EntityPropertyFromValue = gf.EntityPropertyFromValue;
var LoadableProperty = gf.LoadableProperty;
var NamableProperty = gf.NamableProperty;
var Playable = gf.Playable;
var Selectable = gf.Selectable;
var Selector = gf.Selector;
var Universe = gf.Universe;
var UniverseWorldPlaceEntities = gf.UniverseWorldPlaceEntities;
var VenueWorld = gf.VenueWorld;
var World = gf.World;
var WorldCreator = gf.WorldCreator;
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
var ItemCategory = gf.ItemCategory;
var ItemContainer = gf.ItemContainer;
var ItemDefn = gf.ItemDefn;
var ItemHolder = gf.ItemHolder;
var ItemStore = gf.ItemStore;
// Model - Items - Crafting.
var CraftingRecipe = gf.CraftingRecipe;
var ItemCrafter = gf.ItemCrafter;
// Model - Items - Equipment.
var EquipmentSocket = gf.EquipmentSocket;
var EquipmentSocketDefn = gf.EquipmentSocketDefn;
var EquipmentSocketDefnGroup = gf.EquipmentSocketDefnGroup;
var EquipmentSocketGroup = gf.EquipmentSocketGroup;
var EquipmentUser = gf.EquipmentUser;
var Equippable = gf.Equippable;
// Model - Journal.
var Journal = gf.Journal;
var JournalEntry = gf.JournalEntry;
var JournalKeeper = gf.JournalKeeper;
// Model - Maps.
var Terrain = gf.Terrain;
// Model - Mortality.
var Ephemeral = gf.Ephemeral;
var Phase = gf.Phase;
var Phased = gf.Phased;
var Starvable = gf.Starvable;
var Tirable = gf.Tirable;
// Model - Perception.
var Perceptible = gf.Perceptible;
var Perceptor = gf.Perceptor;
// Model - Physics.
var Boundable = gf.Boundable;
var Collidable = gf.Collidable;
var Constrainable = gf.Constrainable;
var ForceField = gf.ForceField;
var Locatable = gf.Locatable;
var Movable = gf.Movable;
var Obstacle = gf.Obstacle;
var Portal = gf.Portal;
var Traversable = gf.Traversable;
var Vehicle = gf.Vehicle;
// Model - Places.
var Place = gf.Place;
var PlaceDefn = gf.PlaceDefn;
var PlaceZoned = gf.PlaceZoned;
var Zone = gf.Zone;
// Model - Skills.
var Skill = gf.Skill;
var SkillLearner = gf.SkillLearner;
// Model - Talk.
var ConversationDefn = gf.ConversationDefn;
var ConversationRun = gf.ConversationRun;
var ConversationScope = gf.ConversationScope;
var TalkNode = gf.TalkNode;
var TalkNodeDefn = gf.TalkNodeDefn;
var Talker = gf.Talker;
var WordBubble = gf.WordBubble;
// Model - Routable.
var Routable = gf.Routable;
var Route = gf.Route;
var RouteNode = gf.RouteNode;
// Model - Time.
var Idleable = gf.Idleable;
var Recurrent = gf.Recurrent;
// Model - Usables.
var Device = gf.Device;
var Usable = gf.Usable;
// Profiles.
var Profile = gf.Profile;
var SaveStateWorld = gf.SaveStateWorld;
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
var DateTime = gf.DateTime;
var DiceRoll = gf.DiceRoll;
var IDHelper = gf.IDHelper;
var PlatformHelper = gf.PlatformHelper;
var RandomizerSystem = gf.RandomizerSystem;
var Reference = gf.Reference;
var Stack = gf.Stack;
var TimerHelper = gf.TimerHelper;
var URLParser = gf.URLParser;
var ValueBreak = gf.ValueBreak;
var ValueBreakGroup = gf.ValueBreakGroup;
var VenueTask = gf.VenueTask;
