Design Architecture of GameFrameworkTS
======================================

Overview
--------

The following diagram illustrates the design architecture of GameFrameworkTS.

    Universe
    |
    +---World
        |
        +---Places
            |
            +---Entities
                |
                +---Properties


Component Details
-----------------

Below is a description of each level of the tree.

### Universe 

There is only one instance of the Universe class, created whenever the program starts.  It members include various helpers for handling of the game clock, user profiles, graphics rendering, audio, user inputs, menu controls, file and data storage, physics calculations, and more.  Perhaps most importantly, it contains a single instance of the World class, which represents the currently loaded "save game".

### World

An instance of the World class corresponds roughly to a "saved game", containing an entire game world and everything in it.  When the user starts a new game, or loads an existing saved game, a new World is created and assigned to the Universe's .world field.

### Place

A World may contain many instances of the Place class, but only a single one is active at any one time.  A Place class generally corresponds to the current "place" in which the player moves around and acts, and possibly interacts with other entities.  In various games, it might correspond to a "level", a "map", a "screen", a "board", or a "room".

### Entity

A Place may contain many instances of the Entity class.  Entities are used to represent the player, enemies, other intelligent agents, obstacles, items, zones that trigger effects when entered, or even simple scenery.  The behavior of each Entity is determined by the contents of its "properties" collection.

### EntityProperty

An Entity may contain many instances of subclasses of the EntityProperty class, each supporting (as of this writing) three methods, namely, .initialize(), .updateForTimerTick(), and .finalize().  Of these, the most important it .updateForTimerTick().  This method is called every time the game clock "ticks", for each property on each Entity in the currently active Place.

Some subclasses of EntityProperty are commonly shared among different game types, while others are more specialized for particular games.  Examples of EntityProperty subclasses, along with the data they are used to represent, include:

* Locatable - A physical object with a definite location in space.
* Boundable - A physical object with a definite shape.
* Movable - A moving object.
* Constrainable - An object with constraints on its movement, like being unable to pass through solid objects.
* Ephemeral - An entity that only lasts for a limited amount of time.
* Killable - An entity that can be destroyed upon incurring enough damage.
* Damager - An entity that can inflict damage on other entities.
* Item - A item that can be picked up and held by a player or other item holder.
* ItemHolder - An entity that can hold one or more items.
* Equippable - An item that can be equipped and subsequently used by the player.
* Portal - A zone that, when touched, transports the impinging entity to another place or location.

