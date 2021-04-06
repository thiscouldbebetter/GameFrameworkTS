Creating a New Stub Game with the This Could Be Better Game Framework
=====================================================================

The TypeScript code in this repository represents a template, or "stub", of a game that uses the This Could Be Better Game Framework.  It is intended as the simplest possible starting point for new game development.  For a much more in-depth example of a game, see the Demo directory in the parent directory.


Setup
-----

The stub game template is expected to be used to create a game with a particular file structure.  Follow these steps to create a Git repository for a new stub game:

* Open a File Explorer window.
* In any desired location (but outside an existing Git repository), create a new directory and name it after the new game, for example, "MyGame".
* Copy the contents of this Stub directory to the new game directory.
* Open a command prompt window.
* Run the command "git init" to convert the new directory into a Git repository.
* Run the command "git submodule add https://github.com/thiscouldbebetter/GameFrameworkTS Framework" to add the This Could Be Better Game Framework as a Git submodule.
* Rename the file "Imports.ts-Renamed.txt" to "Imports.ts".  Renaming the file was necessary to avoid conflicts when compiling the larger project from the parent directory.
* Delete the file "GameStub-RunsInPlace.html", which exists only to demonstrate the stub game's functionality without actually copying it elsewhere.


Building
--------

Follow these steps to build the stub game:

* If you have not already done so, follow all the steps under the "Setup" heading above.
* If you have not already done so, make sure that the "npm" ("Node Package Manager") command is installed, perhaps by running the command "sudo apt install npm".
* If you have not already done so, make sure that the "tsc" ("TypeScript Compiler") command is installed, perhaps by running the command "sudo npm install typescript".
* Run the command "tsc" and verify that no errors are displayed.


Running
-------

Follow these steps to run the stub game:

* If you not already done so, follow all the steps under the "Setup" and "Building" headings above.
* Open the file GameStub.html in a web browser that runs JavaScript.
* Note that there is intentionally no gameplay beyond the initial title and profile setup screens.


Developing a Game
-----------------

To actually implement a game based on the stub, add or modify files in the following locations:

* Readme.md - This file contains high-level, human readable information about the game.  A template is provided.
* Content/ - This directory contains image, sound, video, font, text and other media files.  Some simple ones are provided.
* Source/Game.ts - Pre-loads specified media files, builds and creates the game infrastructure, and starts the game at the title screens.
* Source/WorldGame.ts - Represents a game world and everything in it.  This is approximately equivalent to a "save game".
* Source/PlaceStub.ts - Represents a "location" in the game, containing a list of "entities".  See the Architecture guide for details on how Places and Entites are designed.

At the very least, it is advisable to rename the .ts files and the classes declared within them to something more meaningful to the actual game rather than "Stub".  Note that this will require corresponding changes in the .html file.

Note that any added class files added will need to be referenced within the .html file as well.

This topic warrants an entire development guide, but no such guide exists as of this writing.  In the meantime, again, the "/Source/Demo/" directory provides some usage examples.
