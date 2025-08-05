"use strict";

// Model.
import Entity = gf.Entity;
import EntityBuilder = gf.EntityBuilder;
import EntityGenerator = gf.EntityGenerator;
import EntityProperty = gf.EntityProperty;
import EntityPropertyBase = gf.EntityPropertyBase;
import EntityPropertyFromValue = gf.EntityPropertyFromValue;
import LoadableProperty = gf.LoadableProperty;
import NamableProperty = gf.NamableProperty;
import Playable = gf.Playable;
import Relatable = gf.Relatable;
import Selectable = gf.Selectable;
import Selector = gf.Selector;
import Trigger = gf.Trigger;
import Triggerable = gf.Triggerable;
import Universe = gf.Universe;
import UniverseWorldPlaceEntities = gf.UniverseWorldPlaceEntities;
import Venue = gf.Venue;
import VenueDrawnOnlyWhenUpdated = gf.VenueDrawnOnlyWhenUpdated;
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
import Killable = gf.Killable;
import ProjectileGeneration = gf.ProjectileGeneration;
import ProjectileGenerator = gf.ProjectileGenerator;
import Weapon = gf.Weapon;

// Model - Effects.
import Effect = gf.Effect;
import Effectable = gf.Effectable;

// Model - Items.
import Item = gf.Item;
import ItemBarterer = gf.ItemBarterer;
import ItemCategory = gf.ItemCategory;
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
import EquipmentSocketGroup = gf.EquipmentSocketGroup;
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
import PlaceBase = gf.PlaceBase;
import PlaceDefn = gf.PlaceDefn;
import PlaceZoned = gf.PlaceZoned;
import Zone = gf.Zone;

// Model - Skills.
import Skill = gf.Skill;
import SkillLearner = gf.SkillLearner;

// Model - Statistics.
import Leaderboard = gf.Leaderboard;
import Scorable = gf.Scorable;
import StatsKeeper = gf.StatsKeeper;

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
