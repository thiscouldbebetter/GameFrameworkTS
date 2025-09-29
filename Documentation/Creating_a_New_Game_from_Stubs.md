Creating a New Game from Stubs with the This Could Be Better Game Framework
===========================================================================

The TypeScript code in this repository represents a template, or "stub",
of a game that uses the This Could Be Better Game Framework. 
It is intended as the simplest possible starting point for new game development.
For a much more in-depth example of a game, see the Demo directory
in the parent directory.


Setup
-----

The stub game template is expected to be used to create a game
with a particular file structure.  Follow these steps to create
a Git repository for a new stub game:

* If you have not already done so, make sure that the "git" command is installed.
* Copy this Stub directory and its contents to any desired directory outside of an existing Git repository.
* From within the Stub directory, run the command "./Setup-Git-Init_Repo_and_Add_Framework_Submodule.sh" to start a script that converts the new directory into a Git repository and adds the Framework repository to it as a submodule.


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

At the very least, it is advisable to rename the .ts files and the classes declared within them to something more meaningful to the actual game rather than "Stub".  Note that this will require corresponding changes in the .html file.  The corresponding .js files of renamed .ts files should also be deleted.

Note that any added class files will need to be referenced within the .html file as well.  If those classes come from the framework, they also need to be added to Imports.ts to allow them to be used in other code without qualifying them with their namespace every time.

This topic warrants an entire development guide.  A partial, step-by-step tutorial is available at /Documentation/Development_Guide/Development_Guide.txt in the GameFrameworkTS repository.  Also, again, the "/Source/Demo/" directory provides a wealth of usage examples.
