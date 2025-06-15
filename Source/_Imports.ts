"use strict";

// Classes from the framework must be imported here
// or in some other _Imports.ts file
// so that they can be referenced without using the namespace.

// hack
// These classes currently have to come first.
import RandomizerLCG = gf.RandomizerLCG;

// Helpers.
import ArrayHelper = gf.ArrayHelper;
import NumberHelper = gf.NumberHelper;
import StringHelper = gf.StringHelper;

// hack
import EntityProperty = gf.EntityProperty;
import EntityPropertyBase = gf.EntityPropertyBase;

// Input.
import ActionToInputsMapping = gf.ActionToInputsMapping;
import Input = gf.Input;
import InputHelper = gf.InputHelper;
import UserInputListener = gf.UserInputListener;

// Profiles.
import Profile = gf.Profile;
import SaveStateWorld = gf.SaveStateWorld;

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

// Utility.
import Clonable = gf.Clonable;
import DateTime = gf.DateTime;
import DiceRoll = gf.DiceRoll;
import Equatable = gf.Equatable;
import IDHelper = gf.IDHelper;
import Loadable = gf.Loadable;
import Namable = gf.Namable;
import PlatformHelper = gf.PlatformHelper;
import Randomizer = gf.Randomizer;
import RandomizerSystem = gf.RandomizerSystem;
import Reference = gf.Reference;
import Stack = gf.Stack;
import TimerHelper = gf.TimerHelper;
import Treeable = gf.Treeable;
import URLParser = gf.URLParser;
import ValueBreak = gf.ValueBreak;
import ValueBreakGroup = gf.ValueBreakGroup;
import VenueTask = gf.VenueTask;
