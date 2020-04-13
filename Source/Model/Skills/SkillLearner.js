
class SkillLearner
{
	constructor(skillBeingLearnedName, learningAccumulated, skillsKnownNames)
	{
		this.skillBeingLearnedName = skillBeingLearnedName;
		this.learningAccumulated = learningAccumulated || 0;
		this.skillsKnownNames = skillsKnownNames || [];
	}

	isLearningInProgress()
	{
		return (this.learningAccumulated > 0);
	};

	isSkillBeingLearned()
	{
		return (this.skillBeingLearnedName != null);
	};

	skillCheapestAvailable(skillsAll)
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

	learningIncrement(skillsAll, amountToIncrement)
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

	learningAccumulatedOverRequired(skillsAll)
	{
		return this.learningAccumulated + "/" + this.learningRequired(skillsAll);
	};

	learningRequired(skillsAllByName)
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

	skillSelected(skillsAll)
	{
		return (this.skillSelectedName == null ? null : skillsAll(this.skillSelectedName));
	};

	skillsAvailableToLearn(skillsAll)
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

	skillsKnown(skillsAllByName)
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

	skillBeingLearned(skillsAllByName)
	{
		var returnValue = skillsAllByName[this.skillBeingLearnedName];

		return returnValue;
	};

	// entity

	updateForTimerTick(universe, world, place, entity)
	{
		// Do nothing.
	}

	// controls

	toControl(universe, sizeIgnored, entity, venueToReturnTo, includeTitle)
	{
		var display = universe.display;
		var size = display.sizeInPixels.clone();
		var labelHeight = display.fontHeightInPixels * 1.2;
		var margin = 20;
		var labelHeightLarge = labelHeight * 2;
		var buttonHeight = labelHeight;
		var buttonSize = new Coords(2, 1).multiplyScalar(margin);

		var listSize = new Coords(
			(size.x - margin * 3) / 2,
			150
		); // size

		var skillsAll = universe.world.defns.skills;

		var back = function()
		{
			var venueNext = venueToReturnTo;
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var returnValue = new ControlContainer
		(
			"Skills", // name,
			new Coords(0, 0), // pos,
			size.clone(),
			// children
			[
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
						size.x - margin - buttonSize.x,
						size.y - margin - buttonSize.y
					), //pos,
					buttonSize.clone(), // size,
					"Done", // text,
					labelHeight, // fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					back
				)
			]
		);

		if (includeTitle)
		{
			returnValue.children.insertElementAt
			(
				new ControlLabel
				(
					"labelSkills",
					new Coords(200, 20), // pos
					new Coords(120, 25), // size
					true, // isTextCentered
					"Skills",
					labelHeightLarge
				),
				0 // indexToInsertAt
			);
		}
		else
		{
			var titleHeightInverted = new Coords(0, -30);
			returnValue.size.add(titleHeightInverted);
			returnValue.shiftChildPositions(titleHeightInverted);
		}

		return returnValue;
	};
}
