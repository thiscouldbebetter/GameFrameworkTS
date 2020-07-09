
class SkillLearner
{
	skillBeingLearnedName: string;
	learningAccumulated: number;
	skillsKnownNames: string[];

	skillSelectedName: string;

	constructor(skillBeingLearnedName: string, learningAccumulated: number, skillsKnownNames: string[])
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

	skillCheapestAvailable(skillsAll: any)
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

	learningIncrement(skillsAll: any, amountToIncrement: number)
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

	learningAccumulatedOverRequired(skillsAll: any)
	{
		return this.learningAccumulated + "/" + this.learningRequired(skillsAll);
	};

	learningRequired(skillsAllByName: any)
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

	skillSelected(skillsAll: any)
	{
		return (this.skillSelectedName == null ? null : skillsAll(this.skillSelectedName));
	};

	skillsAvailableToLearn(skillsAll: any)
	{
		var skillsUnknown = [];

		for (var i = 0; i < skillsAll.length; i++)
		{
			var skill = skillsAll[i];
			var skillName = skill.name;

			var isAlreadyKnown =
				this.skillsKnownNames.some(x => x == skillName);

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
					this.skillsKnownNames.some(x => x == prerequisite)
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

	skillsKnown(skillsAllByName: any)
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

	skillBeingLearned(skillsAllByName: any)
	{
		var returnValue = skillsAllByName[this.skillBeingLearnedName];

		return returnValue;
	};

	// entity

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		// Do nothing.
	}

	// controls

	toControl(universe: Universe, sizeIgnored: Coords, entity: Entity, venueToReturnTo: Venue, includeTitle: boolean)
	{
		var display = universe.display;
		var size = display.sizeInPixels.clone();
		var labelHeight = display.fontHeightInPixels * 1.2;
		var margin = 20;
		var labelHeightLarge = labelHeight * 2;
		var buttonHeight = labelHeight;
		var buttonSize = new Coords(2, 1, 0).multiplyScalar(margin);

		var listSize = new Coords(
			(size.x - margin * 3) / 2,
			150,
			0
		); // size

		var skillsAll = universe.world.defns.defnArraysByTypeName[Skill.name];

		var back = function()
		{
			var venueNext = venueToReturnTo;
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;
		};

		var returnValue = new ControlContainer
		(
			"Skills", // name,
			new Coords(0, 0, 0), // pos,
			size.clone(),
			// children
			[
				new ControlLabel
				(
					"labelSkillsKnown", // name,
					new Coords(margin, 40, 0), // pos,
					new Coords(size.x - margin * 2, labelHeight, 0), // size,
					false, // isTextCentered,
					"Skills Known:", //text
					labelHeight // fontHeightInPixels
				),

				new ControlList
				(
					"listSkillsKnown",
					new Coords(margin, 60, 0), // pos
					listSize,
					// items
					new DataBinding
					(
						this.skillsKnownNames, null, null
					),
					new DataBinding(null, null, null), // bindingForItemText
					labelHeight, // fontHeightInPixels
					null, null, null, null, null
				),

				new ControlLabel
				(
					"labelSkillsAvailable", // name,
					new Coords(size.x - margin - listSize.x, 40, 0), // pos,
					new Coords(size.x - margin * 2, labelHeight, 0), // size,
					false, // isTextCentered,
					new DataBinding("Skills Available:", null, null), // text
					labelHeight // fontHeightInPixels
				),

				new ControlList
				(
					"listSkillsAvailable", // name,
					new Coords(size.x - margin - listSize.x, 60, 0), // pos,
					listSize,
					// items,
					new DataBinding
					(
						this,
						function get(c: any)
						{
							return c.skillsAvailableToLearn(skillsAll);
						},
						null
					),
					new DataBinding
					(
						null, function get(c) { return c.name; }, null
					), // bindingForItemText
					labelHeight, // fontHeightInPixels
					new DataBinding
					(
						this,
						function get(c: any) { return c.skillBeingLearned(skillsAll); },
						function set(c: any, v: any)
						{
							c.skillBeingLearnedName = v;
							c.skillSelectedName = v;
						}
					), // bindingForItemSelected
					new DataBinding
					(
						null, function get(c: any) { return c.name; }, null
					), // bindingForItemValue
					null, null, null
				),

				new ControlLabel
				(
					"labelSkillSelected", // name,
					new Coords(margin, 220, 0), // pos,
					new Coords(size.x - margin * 2, labelHeight, 0), // size,
					false, // isTextCentered,
					"Selected:", // text
					null
				),

				new ControlLabel
				(
					"labelSkillSelected", // name,
					new Coords(80, 220, 0), // pos,
					new Coords(size.x - margin * 2, labelHeight, 0), // size,
					false, // isTextCentered,
					new DataBinding
					(
						this, (c: any) => (c.skillSelectedName || "-"), null
					),
					null
				),

				new ControlLabel
				(
					"labelSkillBeingLearned", // name,
					new Coords(margin, size.y - margin - labelHeight * 2, 0), // pos,
					new Coords(size.x - margin * 2, labelHeight, 0), // size,
					false, // isTextCentered,
					"Skill Being Learned:", // text
					null
				),

				new ControlLabel
				(
					"textSkillBeingLearned", // name,
					new Coords(155, size.y - margin - labelHeight * 2, 0), // pos,
					new Coords(size.x - margin * 2, labelHeight, 0), // size,
					false, // isTextCentered,
					new DataBinding
					(
						this,
						function get(c)
						{
							return (c.skillBeingLearnedName || "-");
						},
						null
					),
					null
				),

				new ControlLabel
				(
					"labelLearningAccumulated", // name,
					new Coords(margin, size.y - margin - labelHeight, 0), // pos,
					new Coords(size.x - margin * 2, labelHeight, 0), // size,
					false, // isTextCentered,
					"Learning Accumulated:", // text
					null
				),

				new ControlLabel
				(
					"textLearningAccumulated", // name,
					new Coords(160, size.y - margin - labelHeight, 0), // pos,
					new Coords(30, labelHeight, 0), // size,
					false, // isTextCentered,
					new DataBinding
					(
						this,
						function get(c)
						{
							return c.learningAccumulatedOverRequired(skillsAll);
						},
						null
					), // text
					null
				),
			],
			null, null
		);

		if (includeTitle)
		{
			returnValue.children.splice
			(
				0, 0,
				new ControlLabel
				(
					"labelSkills",
					new Coords(200, 20, 0), // pos
					new Coords(120, 25, 0), // size
					true, // isTextCentered
					"Skills",
					labelHeightLarge
				)
			);
		}
		else
		{
			var titleHeightInverted = new Coords(0, -30, 0);
			returnValue.size.add(titleHeightInverted);
			returnValue.shiftChildPositions(titleHeightInverted);
		}

		return returnValue;
	};
}
