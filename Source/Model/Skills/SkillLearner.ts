
namespace ThisCouldBeBetter.GameFramework
{

export class SkillLearner implements EntityProperty<SkillLearner>
{
	skillBeingLearnedName: string;
	learningAccumulated: number;
	skillsKnownNames: string[];

	skillSelectedName: string;
	statusMessage: string;

	constructor
	(
		skillBeingLearnedName: string,
		learningAccumulated: number,
		skillsKnownNames: string[]
	)
	{
		this.skillBeingLearnedName = skillBeingLearnedName;
		this.learningAccumulated = learningAccumulated || 0;
		this.skillsKnownNames = skillsKnownNames || [];
	}

	static default(): SkillLearner
	{
		return new SkillLearner(null, null, null);
	}

	isLearningInProgress(): boolean
	{
		return (this.learningAccumulated > 0);
	}

	isSkillBeingLearned(): boolean
	{
		return (this.skillBeingLearnedName != null);
	}

	skillCheapestAvailable(skillsAll: Skill[]): Skill
	{
		var skillCheapest: Skill = null;

		var skillsAvailable = this.skillsAvailableToLearn(skillsAll);
		if (skillsAvailable.length > 0)
		{
			skillCheapest = skillsAvailable.sort
			(
				(x: Skill, y: Skill) => x.learningRequired - y.learningRequired
			)[0];
		}
		return skillCheapest;
	}

	learningIncrement
	(
		skillsAll: Skill[], skillsByName: Map<string, Skill>,
		amountToIncrement: number
	): void
	{
		var message = null;

		var skillBeingLearned = this.skillBeingLearned(skillsByName);

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

		this.statusMessage = message;
	}

	learningAccumulatedOverRequired
	(
		skillsAllByName: Map<string,Skill>
	): string
	{
		return this.learningAccumulated + "/" + this.learningRequired(skillsAllByName);
	}

	learningRequired(skillsAllByName: Map<string, Skill>): number
	{
		var skillBeingLearned = this.skillBeingLearned(skillsAllByName);
		var returnValue =
		(
			skillBeingLearned == null
			? 0
			: skillBeingLearned.learningRequired
		);
		return returnValue;
	}

	skillSelected(skillsAllByName: Map<string, Skill>): Skill
	{
		var returnValue =
		(
			this.skillSelectedName == null
			? null
			: skillsAllByName.get(this.skillSelectedName)
		);

		return returnValue;
	}

	skillsAvailableToLearn(skillsAll: Skill[]): Skill[]
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
	}

	skillsKnown(skillsAllByName: Map<string, Skill>): Skill[]
	{
		var returnValues = [];

		for (var i = 0; i < this.skillsKnownNames.length; i++)
		{
			var skillName = this.skillsKnownNames[i];
			var skill = skillsAllByName.get(skillName);
			returnValues.push(skill);
		}

		return returnValues;
	}

	skillBeingLearned(skillsAllByName: Map<string, Skill>): Skill
	{
		var returnValue = skillsAllByName.get(this.skillBeingLearnedName);

		return returnValue;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	// Equatable

	equals(other: SkillLearner): boolean { return false; } // todo

	// controls

	toControl
	(
		universe: Universe,
		size: Coords,
		entity: Entity,
		venueToReturnTo: Venue,
		includeTitle: boolean
	): ControlBase
	{
		var display = universe.display;
		//var size = display.sizeInPixels.clone();
		var labelHeight = display.fontHeightInPixels * 1.2;
		var margin = 20;
		var labelHeightLarge = labelHeight * 2;
		var fontHeightInPixels = margin / 2;

		size = size.clone().addDimensions(0, 30, 0); // hack

		var listSize = Coords.fromXY
		(
			(size.x - margin * 3) / 2, 150
		);

		var defns = universe.world.defn;
		var skillLearner = this;
		var skillsAll = defns.skills;
		var skillsAllByName = defns.skillsByName;

		var returnValue = ControlContainer.from4
		(
			"Skills", // name,
			Coords.create(), // pos,
			size.clone(),
			// children
			[
				new ControlLabel
				(
					"labelSkillsKnown", // name,
					Coords.fromXY(margin, 40), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContext("Skills Known:"), //text
					labelHeight // fontHeightInPixels
				),

				ControlList.from6
				(
					"listSkillsKnown",
					Coords.fromXY(margin, 60), // pos
					listSize,
					// items
					DataBinding.fromContext(this.skillsKnownNames),
					DataBinding.fromContext(null), // bindingForItemText
					labelHeight // fontHeightInPixels
				),

				new ControlLabel
				(
					"labelSkillsAvailable", // name,
					Coords.fromXY(size.x - margin - listSize.x, 40), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContext("Skills Available:"), // text
					labelHeight // fontHeightInPixels
				),

				ControlList.from10
				(
					"listSkillsAvailable", // name,
					Coords.fromXY(size.x - margin - listSize.x, 60), // pos,
					listSize,
					// items,
					DataBinding.fromContextAndGet
					(
						this,
						(c: SkillLearner) =>
							c.skillsAvailableToLearn(skillsAll)
					),
					DataBinding.fromGet
					(
						(c: Skill) => c.name
					), // bindingForItemText
					labelHeight, // fontHeightInPixels
					new DataBinding
					(
						this,
						(c: SkillLearner) =>
						{
							return c.skillSelected(skillsAllByName);
						},
						(c: SkillLearner, v: Skill) =>
						{
							var skillName = v.name;
							c.skillSelectedName = skillName;
						}
					), // bindingForItemSelected
					null, // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					(u: Universe) =>
					{
						skillLearner.skillBeingLearnedName =
							skillLearner.skillSelectedName;
					} // confirm
				),

				new ControlLabel
				(
					"labelSkillSelected", // name,
					Coords.fromXY(margin, 220), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContext("Selected:"), // text
					fontHeightInPixels
				),

				new ControlLabel
				(
					"labelSkillSelected", // name,
					Coords.fromXY(80, 220), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContextAndGet
					(
						this, (c: SkillLearner) => (c.skillSelectedName || "-")
					),
					fontHeightInPixels
				),

				new ControlLabel
				(
					"labelSkillSelectedDescription", // name,
					Coords.fromXY(margin, 232), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContextAndGet
					(
						this,
						(c: SkillLearner) =>
						{
							var skill = c.skillSelected(skillsAllByName);
							return (skill == null ? "-" : skill.description);
						}
					),
					fontHeightInPixels
				),

				new ControlLabel
				(
					"labelSkillBeingLearned", // name,
					Coords.fromXY(margin, size.y - margin - labelHeight * 2), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContext("Skill Being Learned:"), // text
					fontHeightInPixels
				),

				new ControlLabel
				(
					"textSkillBeingLearned", // name,
					Coords.fromXY(145, size.y - margin - labelHeight * 2), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContextAndGet
					(
						this,
						(c: SkillLearner) =>
						{
							return (c.skillBeingLearnedName || "-");
						}
					),
					fontHeightInPixels
				),

				new ControlLabel
				(
					"labelLearningAccumulated", // name,
					Coords.fromXY(margin, size.y - margin - labelHeight), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContext("Learning Accumulated:"), // text
					fontHeightInPixels
				),

				new ControlLabel
				(
					"textLearningAccumulated", // name,
					Coords.fromXY(145, size.y - margin - labelHeight), // pos,
					Coords.fromXY(30, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContextAndGet
					(
						this,
						(c: SkillLearner) =>
							c.learningAccumulatedOverRequired(skillsAllByName)
					), // text
					fontHeightInPixels
				),
			]
		);

		if (includeTitle)
		{
			returnValue.children.splice
			(
				0, // indexToInsertAt
				0, // elementsToDelete
				new ControlLabel
				(
					"labelSkills",
					Coords.fromXY(200, 20), // pos
					Coords.fromXY(120, 25), // size
					true, // isTextCentered
					DataBinding.fromContext("Skills"),
					labelHeightLarge
				)
			);
		}
		else
		{
			var titleHeightInverted = Coords.fromXY(0, -30);
			returnValue.size.add(titleHeightInverted);
			returnValue.shiftChildPositions(titleHeightInverted);
		}

		return returnValue;
	}
}

}
