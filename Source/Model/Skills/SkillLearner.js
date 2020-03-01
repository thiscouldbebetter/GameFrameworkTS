
function SkillLearner(skillBeingLearnedName, learningAccumulated, skillsKnownNames)
{
	this.skillBeingLearnedName = skillBeingLearnedName;
	this.learningAccumulated = learningAccumulated || 0;
	this.skillsKnownNames = skillsKnownNames || [];
}

{
	SkillLearner.prototype.isLearningInProgress = function()
	{
		return (this.learningAccumulated > 0);
	};

	SkillLearner.prototype.isSkillBeingLearned = function()
	{
		return (this.skillBeingLearnedName != null);
	};

	SkillLearner.prototype.skillCheapestAvailable = function(skillsAll)
	{
		var returnValue = null;

		var skillsAvailable = this.skillsAvailableToLearn(skillsAll);
		if (skillsAvailable.length > 0)
		{
			var skillCheapest = skillsAvailable.sort
			(
				(x, y) => x - y
			)[0];
			returnValue = skillCheapest;
		}
		return skillCheapest;
	};

	SkillLearner.prototype.learningIncrement = function(skillsAll, amountToIncrement)
	{
		var message = null;

		var skillBeingLearned = this.skillBeingLearned(skillsAll);

		if (skillBeingLearned == null)
		{
			var skillCheapest = this.skillCheapestAvailable(skillsAll);
			if (skillCheapest != null)
			{
				skillBeingLearned = skillCheapest;
				this.skillBeingLearnedName = skillCheapest.name;
				message = "Now learning '" + this.skillBeingLearnedName + "'."
			}
		}

		if (skillBeingLearned != null)
		{
			this.learningAccumulated += amountToIncrement;

			var learningRequired = skillBeingLearned.learningRequired;
			if (this.learningAccumulated >= learningRequired)
			{
				message = "Learned skill '" + this.skillBeingLearnedName + "'.";
				this.skillsKnownNames.push
				(
					this.skillBeingLearnedName
				);
				this.skillBeingLearnedName = null;
				this.learningAccumulated = 0;
			}
		}

		return message;
	};

	SkillLearner.prototype.learningAccumulatedOverRequired = function(skillsAll)
	{
		return this.learningAccumulated + "/" + this.learningRequired(skillsAll);
	};

	SkillLearner.prototype.learningRequired = function(skillsAllByName)
	{
		var skillBeingLearned = this.skillBeingLearned(skillsAllByName);
		var returnValue =
		(
			skillBeingLearned == null
			? 0
			: skillBeingLearned.learningRequired
		);
		return returnValue;
	};

	SkillLearner.prototype.skillSelected = function(skillsAll)
	{
		return (this.skillSelectedName == null ? null : skillsAll(this.skillSelectedName));
	};

	SkillLearner.prototype.skillsAvailableToLearn = function(skillsAll)
	{
		var skillsUnknown = [];

		for (var i = 0; i < skillsAll.length; i++)
		{
			var skill = skillsAll[i];
			var skillName = skill.name;

			var isAlreadyKnown =
				this.skillsKnownNames.contains(skillName);

			if (isAlreadyKnown == false)
			{
				skillsUnknown.push(skill);
			}
		}

		var skillsUnknownWithKnownPrerequisites = [];

		for (var i = 0; i < skillsUnknown.length; i++)
		{
			var skill = skillsUnknown[i];
			var prerequisites = skill.namesOfPrerequisiteSkills;

			var areAllPrerequisitesKnown = true;

			for (var p = 0; p < prerequisites.length; p++)
			{
				var prerequisite = prerequisites[p];
				var isPrerequisiteKnown =
				(
					this.skillsKnownNames.contains(prerequisite)
				);

				if (isPrerequisiteKnown == false)
				{
					areAllPrerequisitesKnown = false;
					break;
				}
			}

			if (areAllPrerequisitesKnown)
			{
				skillsUnknownWithKnownPrerequisites.push
				(
					skill
				);
			}
		}

		return skillsUnknownWithKnownPrerequisites;
	};

	SkillLearner.prototype.skillsKnown = function(skillsAllByName)
	{
		var returnValues = [];

		for (var i = 0; i < this.skillsKnownNames.length; i++)
		{
			var skillName = this.skillsKnownNames[i];
			var skill = skillsAllByName[skillName];
			returnValues.push(skill);
		}

		return returnValues;
	};

	SkillLearner.prototype.skillBeingLearned = function(skillsAllByName)
	{
		var returnValue = skillsAllByName[this.skillBeingLearnedName];

		return returnValue;
	};

	// entity

	SkillLearner.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		// Do nothing.
	}

	// controls

	SkillLearner.prototype.toControl = function(universe, sizeIgnored, entity, venueToReturnTo)
	{
		if (this._control != null)
		{
			return this._control;
		}

		var display = universe.display;
		var size = display.sizeInPixels;
		var margin = display.fontHeightInPixels;
		var labelHeight = display.fontHeightInPixels * 1.5;
		var labelHeightLarge = labelHeight * 2;
		var buttonHeight = labelHeight * 2;
		var listSize = new Coords(
			(size.x - margin * 3) / 2,
			150
		); // size

		var skillsAll = universe.world.defns.skills;

		this._control = new ControlContainer
		(
			"containerLearningSession", // name,
			new Coords(0, 0), // pos,
			size,
			// children
			[
				new ControlLabel
				(
					"labelSkills",
					new Coords(200, 20), // pos
					new Coords(120, 25), // size
					true, // isTextCentered
					"Skills",
					labelHeightLarge
				),

				new ControlLabel
				(
					"labelSkillsKnown", // name,
					new Coords(margin, 40), // pos,
					new Coords(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					"Skills Known:", //text
					labelHeight // fontHeightInPixels
				),

				new ControlList
				(
					"listSkillsKnown",
					new Coords(margin, 60), // pos
					listSize,
					// items
					new DataBinding
					(
						this.skillsKnownNames
					),
					new DataBinding(), // bindingForItemText
					labelHeight // fontHeightInPixels
				),

				new ControlLabel
				(
					"labelSkillsAvailable", // name,
					new Coords(size.x - margin - listSize.x, 40), // pos,
					new Coords(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					new DataBinding("Skills Available:"), // text
					labelHeight // fontHeightInPixels
				),

				new ControlList
				(
					"listSkillsAvailable", // name,
					new Coords(size.x - margin - listSize.x, 60), // pos,
					listSize,
					// items,
					new DataBinding
					(
						this,
						function get(c)
						{
							return c.skillsAvailableToLearn(skillsAll);
						}
					),
					new DataBinding
					(
						null, function get(c) { return c.name; }
					), // bindingForItemText
					labelHeight, // fontHeightInPixels
					new DataBinding
					(
						this,
						function get(c) { return c.skillBeingLearned(skillsAll); },
						function set(c, v)
						{
							c.skillBeingLearnedName = v;
							c.skillSelectedName = v;
						}
					), // bindingForItemSelected
					new DataBinding
					(
						null, function get(c) { return c.name; }
					) // bindingForItemValue
				),

				new ControlLabel
				(
					"labelSkillSelected", // name,
					new Coords(margin, 220), // pos,
					new Coords(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					"Selected:" // text
				),

				new ControlLabel
				(
					"labelSkillSelected", // name,
					new Coords(80, 220), // pos,
					new Coords(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					new DataBinding
					(
						this, (c) => (c.skillSelectedName || "-")
					)
				),

				new ControlLabel
				(
					"labelSkillBeingLearned", // name,
					new Coords(margin, size.y - margin - labelHeight * 2), // pos,
					new Coords(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					"Skill Being Learned:" // text
				),

				new ControlLabel
				(
					"textSkillBeingLearned", // name,
					new Coords(155, size.y - margin - labelHeight * 2), // pos,
					new Coords(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					new DataBinding
					(
						this,
						function get(c)
						{
							return (c.skillBeingLearnedName || "-");
						}
					)
				),

				new ControlLabel
				(
					"labelLearningAccumulated", // name,
					new Coords(margin, size.y - margin - labelHeight), // pos,
					new Coords(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					"Learning Accumulated:" // text
				),

				new ControlLabel
				(
					"textLearningAccumulated", // name,
					new Coords(160, size.y - margin - labelHeight), // pos,
					new Coords(30, labelHeight), // size,
					false, // isTextCentered,
					new DataBinding
					(
						this,
						function get(c)
						{
							return c.learningAccumulatedOverRequired(skillsAll);
						}
					) // text
				),

				new ControlButton
				(
					"buttonBack", //name,
					new Coords
					(
						size.x - margin - buttonHeight,
						size.y - margin - buttonHeight
					), //pos,
					new Coords(buttonHeight, buttonHeight), // size,
					"Done", // text,
					labelHeight, // fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click()
					{
						var venueNext = new VenueWorld(universe.world);
						venueNext = new VenueFader(venueNext, venueToReturnTo);
						universe.venueNext = venueNext;
					}
				)
			]
		);

		return this._control;
	};
}
