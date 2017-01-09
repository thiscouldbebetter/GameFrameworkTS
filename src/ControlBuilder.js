
// classes

function ControlBuilder()
{
	this.fontHeightInPixelsBase = 10;
	this.sizeBase = new Coords(200, 150);
}
{	
	ControlBuilder.prototype.configure = function(size)
	{		
		if (size == null)
		{
			sizeMultiplier = new Coords(1, 1);
		}
		else
		{
			sizeMultiplier = size.clone().divide(this.sizeBase);
		}
	
		var returnValue = new ControlContainer
		(
			"containerConfigure",
			new Coords(0, 0).multiply(sizeMultiplier), // pos
			new Coords(200, 150).multiply(sizeMultiplier), // size
			// children
			[
				new ControlButton
				(
					"buttonSave",
					new Coords(50, 15).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					"Save",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var profile = universe.profile;
						var world = universe.world;

						world.dateSaved = DateTime.now();

						Globals.Instance.profileHelper.profileSave
						(
							profile
						);

						var venueNext = new VenueWorld(world);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),

				new ControlLabel
				(
					"labelMusicVolume",
					new Coords(50, 45).multiply(sizeMultiplier), // pos
					new Coords(75, 25).multiply(sizeMultiplier), // size
					false, // isTextCentered
					"Music Volume:",
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlSelect
				(
					"selectMusicVolume",
					new Coords(125, 45).multiply(sizeMultiplier), // pos
					new Coords(25, 25).multiply(sizeMultiplier), // size

					// dataBindingForValueSelected
					new DataBinding
					(
						Globals.Instance.soundHelper, 
						"musicVolume"
					),

					// dataBindingForOptions
					new DataBinding
					(
						SoundHelper.controlSelectOptionsVolume(),
						null
					),

					"value", // bindingExpressionForOptionValues,
					"text", // bindingExpressionForOptionText
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlLabel
				(
					"labelSoundVolume",
					new Coords(50, 75).multiply(sizeMultiplier), // pos
					new Coords(75, 25).multiply(sizeMultiplier), // size
					false, // isTextCentered
					"Sound Volume:",
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlSelect
				(
					"selectSoundVolume",
					new Coords(125, 75).multiply(sizeMultiplier), // pos
					new Coords(25, 25).multiply(sizeMultiplier), // size

					// dataBindingForValueSelected
					new DataBinding
					(
						Globals.Instance.soundHelper, 
						"soundVolume"
					),

					// dataBindingForOptions
					new DataBinding
					(
						SoundHelper.controlSelectOptionsVolume(),
						null
					),

					"value", // bindingExpressionForOptionValues,
					"text", // bindingExpressionForOptionText
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlButton
				(
					"buttonReturn",
					new Coords(50, 105).multiply(sizeMultiplier), // pos
					new Coords(45, 25).multiply(sizeMultiplier), // size
					"Return",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function()
					{
						var universe = Globals.Instance.universe;
						var world = universe.world;
						var venueNext = new VenueWorld(world);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),
	
				new ControlButton
				(
					"buttonQuit",
					new Coords(105, 105).multiply(sizeMultiplier), // pos
					new Coords(45, 25).multiply(sizeMultiplier), // size
					"Quit",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function()
					{					
						var controlConfirm = new ControlBuilder().confirm
						(
							size,
							"Are you sure you want to quit?",
							// confirm
							function()
							{
								Globals.Instance.reset();
								var universe = Globals.Instance.universe;
								var venueNext = new VenueControls
								(
									new ControlBuilder().title(size)
								);
								venueNext = new VenueFader(venueNext);
								universe.venueNext = venueNext;
							},
							// cancel
							function()
							{
								var universe = Globals.Instance.universe;
								var venueNext = new VenueControls
								(
									new ControlBuilder().configure(size)
								);
								venueNext = new VenueFader(venueNext);
								universe.venueNext = venueNext;
							}						
						);

						var venueNext = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext);
						Globals.Instance.universe.venueNext = venueNext;
					}
				),
			]
		);
		
		return returnValue;
	}

	ControlBuilder.prototype.confirm = function(size, message, confirm, cancel)
	{
		if (size == null)
		{
			sizeMultiplier = new Coords(1, 1);
		}
		else
		{
			sizeMultiplier = size.clone().divide(this.sizeBase);
		}
				
		var returnValue = new ControlContainer
		(
			"containerConfirm",
			new Coords(0, 0).multiply(sizeMultiplier), // pos
			new Coords(200, 150).multiply(sizeMultiplier), // size
			// children
			[
				new ControlLabel
				(
					"labelMessage",
					new Coords(50, 50).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					message,
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlButton
				(
					"buttonConfirm",
					new Coords(50, 100).multiply(sizeMultiplier), // pos
					new Coords(45, 25).multiply(sizeMultiplier), // size
					"Confirm",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					confirm
				),

				new ControlButton
				(
					"buttonCancel",
					new Coords(100, 100).multiply(sizeMultiplier), // pos
					new Coords(45, 25).multiply(sizeMultiplier), // size
					"Cancel",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					cancel
				),
			]
		);

		return returnValue;
	}


	ControlBuilder.prototype.profileDetail = function(size)
	{
		if (size == null)
		{
			sizeMultiplier = new Coords(1, 1);
		}
		else
		{
			sizeMultiplier = size.clone().divide(this.sizeBase);
		}
		
		var returnValue = new ControlContainer
		(
			"containerProfileDetail",
			new Coords(0, 0).multiply(sizeMultiplier), // pos
			new Coords(200, 150).multiply(sizeMultiplier), // size
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					new Coords(50, 25).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					Globals.Instance.universe.profile.name,
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlList
				(
					"listWorlds",
					new Coords(25, 50).multiply(sizeMultiplier), // pos
					new Coords(150, 50).multiply(sizeMultiplier), // size
					new DataBinding
					(
						Globals.Instance.universe.profile.worlds,
						null
					),
					"name", 
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),
	
				new ControlButton
				(
					"buttonNew",
					new Coords(50, 110).multiply(sizeMultiplier), // pos
					new Coords(45, 25).multiply(sizeMultiplier), // size
					"New",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function ()
					{
						var world = World.new();

						var universe = Globals.Instance.universe;
						var profile = universe.profile;
						profile.worlds.push(world);

						Globals.Instance.profileHelper.profileSave
						(
							profile
						);				

						universe.world = world;
						var venueNext = new VenueControls
						(
							new ControlBuilder().worldDetail(size)
						);
						venueNext = new VenueVideo
						(
							"Movie", // videoName
							venueNext
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),

				new ControlButton
				(
					"buttonSelect",
					new Coords(105, 110).multiply(sizeMultiplier), // pos
					new Coords(45, 25).multiply(sizeMultiplier), // size
					"Select",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function ()
					{
						var listWorlds = this.parent.children["listWorlds"];
						var worldSelected = listWorlds.itemSelected();
						if (worldSelected != null)
						{
							var universe = Globals.Instance.universe;
							universe.world = worldSelected;
							var venueNext = new VenueControls
							(
								new ControlBuilder().worldDetail(size)
							);
							venueNext = new VenueFader(venueNext);
							universe.venueNext = venueNext;
						}
					}
				),	
				
				new ControlButton
				(
					"buttonBack",
					new Coords(10, 10).multiply(sizeMultiplier), // pos
					new Coords(15, 15).multiply(sizeMultiplier), // size
					"<",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function ()
					{
						var venueNext = new VenueControls
						(
							new ControlBuilder().profileSelect(size)
						);
						venueNext = new VenueFader(venueNext);
						var universe = Globals.Instance.universe;
						universe.venueNext = venueNext;
					}
				),

				new ControlButton
				(
					"buttonDelete",
					new Coords(180, 10).multiply(sizeMultiplier), // pos
					new Coords(15, 15).multiply(sizeMultiplier), // size
					"x",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var profile = universe.profile;

						var controlConfirm = new ControlBuilder().confirm
						(
							size,
							"Delete profile \"" 
								+ profile.name 
								+ "\"?",
							// confirm
							function()
							{
								var universe = Globals.Instance.universe;
								var profile = universe.profile;
								Globals.Instance.profileHelper.profileDelete
								(
									profile
								);

								var venueNext = new VenueControls
								(
									new ControlBuilder().profileSelect(size)
								);
								venueNext = new VenueFader(venueNext);
								universe.venueNext = venueNext;
							},
							// cancel
							function()
							{
								var venueNext = new VenueControls
								(
									new ControlBuilder().profileDetail(size)
								);
								venueNext = new VenueFader(venueNext);
								var universe = Globals.Instance.universe;
								universe.venueNext = venueNext;
							}						
						);

						var venueNext = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),
			]
		);

		return returnValue;
	}

	ControlBuilder.prototype.profileNew = function(size)
	{
		if (size == null)
		{
			sizeMultiplier = new Coords(1, 1);
		}
		else
		{
			sizeMultiplier = size.clone().divide(this.sizeBase);
		}
		
		return new ControlContainer
		(
			"containerProfileNew",
			new Coords(0, 0).multiply(sizeMultiplier), // pos
			new Coords(200, 150).multiply(sizeMultiplier), // size
			// children
			[
				new ControlLabel
				(
					"labelName",
					new Coords(50, 25).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					"Name:",
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlTextBox
				(
					"textBoxName",
					new Coords(50, 50).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					""
				),

				new ControlButton
				(
					"buttonCreate",
					new Coords(50, 80).multiply(sizeMultiplier), // pos
					new Coords(45, 25).multiply(sizeMultiplier), // size
					"Create",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function ()
					{
						var textBoxName = this.parent.children["textBoxName"];
						var profileName = textBoxName.text;
						if (profileName == "")
						{
							return;
						}

						var profile = new Profile(profileName, []);
						Globals.Instance.profileHelper.profileAdd
						(
							profile
						);

						var universe = Globals.Instance.universe;
						universe.profile = profile;
						var venueNext = new VenueControls
						(
							new ControlBuilder().profileDetail(size)
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),

				new ControlButton
				(
					"buttonCancel",
					new Coords(105, 80).multiply(sizeMultiplier), // pos
					new Coords(45, 25).multiply(sizeMultiplier), // size
					"Cancel",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var venueNext = new VenueControls
						(
							new ControlBuilder().profileSelect(size)
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),
			]
		);
	}

	ControlBuilder.prototype.profileSelect = function(size)
	{
		if (size == null)
		{
			sizeMultiplier = new Coords(1, 1);
		}
		else
		{
			sizeMultiplier = size.clone().divide(this.sizeBase);
		}		
		
		var profiles = Globals.Instance.profileHelper.profiles();
		
		var returnValue = new ControlContainer
		(
			"containerProfileSelect",
			new Coords(0, 0).multiply(sizeMultiplier), // pos
			new Coords(200, 150).multiply(sizeMultiplier), // size
			// children
			[
				new ControlLabel
				(
					"labelSelectAProfile",
					new Coords(50, 25).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					"Select a Profile:",
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlList
				(
					"listProfiles",
					new Coords(50, 55).multiply(sizeMultiplier), // pos
					new Coords(100, 50).multiply(sizeMultiplier), // size
					new DataBinding
					(
						profiles,
						null
					),
					"name",
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlButton
				(
					"buttonNew",
					new Coords(50, 110).multiply(sizeMultiplier), // pos
					new Coords(45, 25).multiply(sizeMultiplier), // size
					"New",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var venueNext = new VenueControls
						(
							new ControlBuilder().profileNew(size)
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),


				new ControlButton
				(
					"buttonSelect",
					new Coords(105, 110).multiply(sizeMultiplier), // pos
					new Coords(45, 25).multiply(sizeMultiplier), // size
					"Select",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function()
					{	
						var listProfiles = this.parent.children["listProfiles"];
						var profileSelected = listProfiles.itemSelected();
						var universe = Globals.Instance.universe;
						universe.profile = profileSelected;
						var venueNext = new VenueControls
						(
							new ControlBuilder().profileDetail(size)
						);				
						venueNext = new VenueFader(venueNext);		
						universe.venueNext = venueNext;
					}
				),

			]
		);

		return returnValue;
	}

	ControlBuilder.prototype.title = function(size)
	{
		if (size == null)
		{
			sizeMultiplier = new Coords(1, 1);
		}
		else
		{
			sizeMultiplier = size.clone().divide(this.sizeBase);
		}
				
		return new ControlContainer
		(
			"containerTitle",
			new Coords(0, 0).multiply(sizeMultiplier), // pos
			new Coords(200, 150).multiply(sizeMultiplier), // size
			// children
			[
				new ControlImage
				(
					"imageTitle",
					new Coords(0, 0).multiply(sizeMultiplier),
					new Coords(200, 150).multiply(sizeMultiplier), // size
					"Title.png"
				),
	
				/*
				new ControlLabel
				(
					"labelTitle",
					new Coords(50, 50), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					Globals.Instance.programName
				),
				*/
	
				new ControlButton
				(
					"buttonStart",
					new Coords(75, 100).multiply(sizeMultiplier), // pos
					new Coords(50, 25).multiply(sizeMultiplier), // size
					"Start",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function()
					{
						var venueNext = new VenueControls
						(
							new ControlBuilder().profileSelect(size)
						);
						venueNext = new VenueFader(venueNext);
						var universe = Globals.Instance.universe;
						universe.venueNext = venueNext;
					}
				),
				
				new ControlButton
				(
					"buttonTestDemo",
					new Coords(75, 125).multiply(sizeMultiplier), // pos
					new Coords(50, 25).multiply(sizeMultiplier), // size
					"Test Demo",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function()
					{
						var universe = Globals.Instance.universe;
						universe.world = World.new();
						var venueNext = new VenueWorld(universe.world);
						universe.venueNext = venueNext;
					}
				),
				
			]
		);
	}

	ControlBuilder.prototype.worldDetail = function(size)
	{
		if (size == null)
		{
			sizeMultiplier = new Coords(1, 1);
		}
		else
		{
			sizeMultiplier = size.clone().divide(this.sizeBase);
		}		
		
		var universe = Globals.Instance.universe;
		var world = universe.world;

		var returnValue = new ControlContainer
		(
			"containerWorldDetail",
			new Coords(0, 0).multiply(sizeMultiplier), // pos
			new Coords(200, 150).multiply(sizeMultiplier), // size
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					new Coords(50, 15).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					universe.profile.name,
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),
				new ControlLabel
				(
					"labelWorldName",
					new Coords(50, 30).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					world.name,
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),
				new ControlLabel
				(
					"labelStartDate",
					new Coords(50, 45).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					"Started:" + world.dateCreated.toStringTimestamp(),
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),
				new ControlLabel
				(
					"labelSavedDate",
					new Coords(50, 60).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					true, // isTextCentered
					"Saved:" + world.dateSaved.toStringTimestamp(),
					this.fontHeightInPixelsBase * sizeMultiplier.y
				),

				new ControlButton
				(
					"buttonStart",
					new Coords(50, 100).multiply(sizeMultiplier), // pos
					new Coords(100, 25).multiply(sizeMultiplier), // size
					"Start",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function ()
					{
						var universe = Globals.Instance.universe;						
						var venueNext = new VenueWorld
						(
							universe.world
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(10, 10).multiply(sizeMultiplier), // pos
					new Coords(15, 15).multiply(sizeMultiplier), // size
					"<",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function ()
					{
						var venueNext = new VenueControls
						(
							new ControlBuilder().profileDetail(size)
						);
						venueNext = new VenueFader(venueNext);
						var universe = Globals.Instance.universe;
						universe.venueNext = venueNext;
					}
				),	

				new ControlButton
				(
					"buttonDelete",
					new Coords(180, 10).multiply(sizeMultiplier), // pos
					new Coords(15, 15).multiply(sizeMultiplier), // size
					"x",
					this.fontHeightInPixelsBase * sizeMultiplier.y,
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var profile = universe.profile;
						var world = universe.world;

						var controlConfirm = new ControlBuilder().confirm
						(
							size,
							"Delete world \"" 
								+ world.name 
								+ "\"?",
							// confirm
							function()
							{
								var universe = Globals.Instance.universe;
								var profile = universe.profile;
								var world = universe.world;
								var worlds = profile.worlds;
								var worldIndex = worlds.indexOf(world);

								worlds.splice
								(
									worldIndex,
									1
								);
								universe.world = null;
								
								Globals.Instance.profileHelper.profileSave
								(
									profile
								);

								var venueNext = new VenueControls
								(
									new ControlBuilder().profileDetail(size)
								);
								venueNext = new VenueFader(venueNext);
								universe.venueNext = venueNext;
							},
							// cancel
							function()
							{
								var venueNext = new VenueControls
								(
									new ControlBuilder().worldDetail(size)
								);
								venueNext = new VenueFader(venueNext);
								var universe = Globals.Instance.universe;
								universe.venueNext = venueNext;
							}						
						);

						var venueNext = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext);

						universe.venueNext = venueNext;
					}
				),
			]
		);

		return returnValue;
	}	
}
