
// classes

function ControlBuilder()
{}
{
	ControlBuilder.configure = function()
	{
		return new ControlContainer
		(
			"containerConfigure",
			new Coords(0, 0), // pos
			new Coords(200, 150), // size
			// children
			[
				new ControlButton
				(
					"buttonSave",
					new Coords(50, 15), // pos
					new Coords(100, 25), // size
					"Save",
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
					new Coords(50, 45), // pos
					new Coords(75, 25), // size
					false, // isTextCentered
					"Music Volume:"
				),

				new ControlSelect
				(
					"selectMusicVolume",
					new Coords(125, 45), // pos
					new Coords(25, 25), // size

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
					"text" // bindingExpressionForOptionText
				),

				new ControlLabel
				(
					"labelSoundVolume",
					new Coords(50, 75), // pos
					new Coords(75, 25), // size
					false, // isTextCentered
					"Sound Volume:"
				),

				new ControlSelect
				(
					"selectSoundVolume",
					new Coords(125, 75), // pos
					new Coords(25, 25), // size

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
					"text" // bindingExpressionForOptionText
				),

				new ControlButton
				(
					"buttonReturn",
					new Coords(50, 105), // pos
					new Coords(45, 25), // size
					"Return",
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
					new Coords(105, 105), // pos
					new Coords(45, 25), // size
					"Quit",
					// click
					function()
					{
						Globals.Instance.reset();
						var universe = Globals.Instance.universe;
						var venueNext = new VenueControls
						(
							ControlBuilder.title()
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),
			]
		);
	}

	ControlBuilder.confirm = function(message, confirm, cancel)
	{
		var returnValue = new ControlContainer
		(
			"containerConfirm",
			new Coords(0, 0), // pos
			new Coords(200, 150), // size
			// children
			[
				new ControlLabel
				(
					"labelMessage",
					new Coords(50, 50), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					message
				),

				new ControlButton
				(
					"buttonConfirm",
					new Coords(50, 100), // pos
					new Coords(45, 25), // size
					"Confirm",
					confirm
				),

				new ControlButton
				(
					"buttonCancel",
					new Coords(100, 100), // pos
					new Coords(45, 25), // size
					"Cancel",
					cancel
				),
			]
		);

		return returnValue;
	}


	ControlBuilder.profileDetail = function()
	{
		var returnValue = new ControlContainer
		(
			"containerProfileDetail",
			new Coords(0, 0), // pos
			new Coords(200, 150), // size
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					new Coords(50, 25), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					Globals.Instance.universe.profile.name
				),

				new ControlList
				(
					"listWorlds",
					new Coords(25, 50), // pos
					new Coords(150, 50), // size
					new DataBinding
					(
						Globals.Instance.universe.profile.worlds,
						null
					),
					"name"
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(10, 10), // pos
					new Coords(15, 15), // size
					"<",
					// click
					function ()
					{
						var venueNext = new VenueControls
						(
							ControlBuilder.profileSelect()
						);
						venueNext = new VenueFader(venueNext);
						var universe = Globals.Instance.universe;
						universe.venueNext = venueNext;
					}
				),
	
				new ControlButton
				(
					"buttonNew",
					new Coords(50, 110), // pos
					new Coords(45, 25), // size
					"New",
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
							ControlBuilder.worldDetail()
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
					new Coords(105, 110), // pos
					new Coords(45, 25), // size
					"Select",
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
								ControlBuilder.worldDetail()
							);
							venueNext = new VenueFader(venueNext);
							universe.venueNext = venueNext;
						}
					}
				),	

				new ControlButton
				(
					"buttonDelete",
					new Coords(180, 10), // pos
					new Coords(15, 15), // size
					"x",
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var profile = universe.profile;

						var controlConfirm = ControlBuilder.confirm
						(
							"Delete Profile \"" 
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
									ControlBuilder.profileSelect()
								);
								venueNext = new VenueFader(venueNext);
								universe.venueNext = venueNext;
							},
							// cancel
							function()
							{
								var venueNext = new VenueControls
								(
									ControlBuilder.profileDetail()
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

	ControlBuilder.profileNew = function()
	{
		return new ControlContainer
		(
			"containerProfileNew",
			new Coords(0, 0), // pos
			new Coords(200, 150), // size
			// children
			[
				new ControlLabel
				(
					"labelName",
					new Coords(50, 25), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Name:"
				),

				new ControlTextBox
				(
					"textBoxName",
					new Coords(50, 50), // pos
					new Coords(100, 25), // size
					""
				),

				new ControlButton
				(
					"buttonCreate",
					new Coords(50, 80), // pos
					new Coords(45, 25), // size
					"Create",
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
							ControlBuilder.profileDetail()
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),

				new ControlButton
				(
					"buttonCancel",
					new Coords(105, 80), // pos
					new Coords(45, 25), // size
					"Cancel",
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var venueNext = new VenueControls
						(
							ControlBuilder.profileSelect()
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),
			]
		);
	}

	ControlBuilder.profileSelect = function()
	{
		var profiles = Globals.Instance.profileHelper.profiles();
		
		var returnValue = new ControlContainer
		(
			"containerProfileSelect",
			new Coords(0, 0), // pos
			new Coords(200, 150), // size
			// children
			[
				new ControlLabel
				(
					"labelSelectAProfile",
					new Coords(50, 25), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Select a Profile:"
				),

				new ControlList
				(
					"listProfiles",
					new Coords(50, 55), // pos
					new Coords(100, 50), // size
					new DataBinding
					(
						profiles,
						null
					),
					"name"
				),

				new ControlButton
				(
					"buttonNew",
					new Coords(50, 110), // pos
					new Coords(45, 25), // size
					"New",
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var venueNext = new VenueControls
						(
							ControlBuilder.profileNew()
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),


				new ControlButton
				(
					"buttonSelect",
					new Coords(105, 110), // pos
					new Coords(45, 25), // size
					"Select",
					// click
					function()
					{	
						var listProfiles = this.parent.children["listProfiles"];
						var profileSelected = listProfiles.itemSelected();
						var universe = Globals.Instance.universe;
						universe.profile = profileSelected;
						var venueNext = new VenueControls
						(
							ControlBuilder.profileDetail()
						);				
						venueNext = new VenueFader(venueNext);		
						universe.venueNext = venueNext;
					}
				),

			]
		);

		return returnValue;
	}

	ControlBuilder.title = function()
	{
		return new ControlContainer
		(
			"containerTitle",
			new Coords(0, 0), // pos
			new Coords(400, 300), // size
			// children
			[
				new ControlImage
				(
					"imageTitle",
					new Coords(0, 0),
					new Coords(200, 150), // size
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
					new Coords(75, 100), // pos
					new Coords(50, 25), // size
					"Start",
					// click
					function()
					{
						var venueNext = new VenueControls
						(
							ControlBuilder.profileSelect()
						);
						venueNext = new VenueFader(venueNext);
						var universe = Globals.Instance.universe;
						universe.venueNext = venueNext;
					}
				),
			]
		);
	}

	ControlBuilder.worldDetail = function()
	{
		var universe = Globals.Instance.universe;
		var world = universe.world;

		var returnValue = new ControlContainer
		(
			"containerWorldDetail",
			new Coords(0, 0), // pos
			new Coords(200, 150), // size
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					new Coords(50, 15), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					universe.profile.name
				),
				new ControlLabel
				(
					"labelWorldName",
					new Coords(50, 30), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					world.name
				),
				new ControlLabel
				(
					"labelStartDate",
					new Coords(50, 45), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Started:" + world.dateCreated.toStringTimestamp()
				),
				new ControlLabel
				(
					"labelSavedDate",
					new Coords(50, 60), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Saved:" + world.dateSaved.toStringTimestamp()
				),

				new ControlButton
				(
					"buttonStart",
					new Coords(50, 100), // pos
					new Coords(100, 25), // size
					"Start",
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
					new Coords(10, 10), // pos
					new Coords(15, 15), // size
					"<",
					// click
					function ()
					{
						var venueNext = new VenueControls
						(
							ControlBuilder.profileDetail()
						);
						venueNext = new VenueFader(venueNext);
						var universe = Globals.Instance.universe;
						universe.venueNext = venueNext;
					}
				),	

				new ControlButton
				(
					"buttonDelete",
					new Coords(180, 10), // pos
					new Coords(15, 15), // size
					"x",
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var profile = universe.profile;
						var world = universe.world;

						var controlConfirm = ControlBuilder.confirm
						(
							"Delete World \"" 
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
									ControlBuilder.profileDetail()
								);
								venueNext = new VenueFader(venueNext);
								universe.venueNext = venueNext;
							},
							// cancel
							function()
							{
								var venueNext = new VenueControls
								(
									ControlBuilder.worldDetail()
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
