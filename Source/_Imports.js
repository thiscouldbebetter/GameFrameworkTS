"use strict";
// Classes from the framework must be imported here
// or in some other _Imports.ts file
// so that they can be referenced without using the namespace.
// hack
// These classes currently have to come first.
var RandomizerLCG = gf.RandomizerLCG;
// Helpers.
var ArrayHelper = gf.ArrayHelper;
var NumberHelper = gf.NumberHelper;
var StringHelper = gf.StringHelper;
// Input.
var ActionToInputsMapping = gf.ActionToInputsMapping;
var Input = gf.Input;
var InputHelper = gf.InputHelper;
var UserInputListener = gf.UserInputListener;
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
var Randomizer = gf.Randomizer;
var RandomizerSystem = gf.RandomizerSystem;
var Reference = gf.Reference;
var Stack = gf.Stack;
var TimerHelper = gf.TimerHelper;
var URLParser = gf.URLParser;
var ValueBreak = gf.ValueBreak;
var ValueBreakGroup = gf.ValueBreakGroup;
var VenueTask = gf.VenueTask;
