
namespace ThisCouldBeBetter.GameFramework
{

export class SkillLearner extends EntityProperty
{
	skillBeingLearnedName: string;
	learningAccumulated: number;
	skillsKnownNames: string[];

	skillSelectedName: string;

	constructor(skillBeingLearnedName: string, learningAccumulated: number, skillsKnownNames: string[])
	{
		super();
		this.skillBeingLearnedName = skillBeingLearnedName;
		this.learningAccumulated = learningAccumulated || 0;
		this.skillsKnownNames = skillsKnownNames || [];
	}

	isLearningInProgress()
	{
		return (this.learningAccumulated > 0);
	}

	isSkillBeingLearned()
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

	learningIncrement(skillsAll: Skill[], skillsByName: Map<string, Skill>, amountToIncrement: number)
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

		return message;
	}

	learningAccumulatedOverRequired(skillsAllByName: Map<string,Skill>)
	{
		return this.learningAccumulated + "/" + this.learningRequired(skillsAllByName);
	}

	learningRequired(skillsAllByName: Map<string, Skill>)
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

	skillSelected(skillsAllByName: Map<string, Skill>)
	{
		return (this.skillSelectedName == null ? null : skillsAllByName.get(this.skillSelectedName));
	}

	skillsAvailableToLearn(skillsAll: Skill[])
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

	skillsKnown(skillsAllByName: Map<string, Skill>)
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

	skillBeingLearned(skillsAllByName: Map<string, Skill>)
	{
		var returnValue = skillsAllByName.get(this.skillBeingLearnedName);

		return returnValue;
	}

	// entity

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		// Do nothing.
	}

	// controls

	toControl(universe: Universe, size: Coords, entity: Entity, venueToReturnTo: Venue, includeTitle: boolean)
	{
		var display = universe.display;
		//var size = display.sizeInPixels.clone();
		var labelHeight = display.fontHeightInPixels * 1.2;
		var margin = 20;
		var labelHeightLarge = labelHeight * 2;

		size = size.clone().add(new Coords(0, 30, 0)); // hack

		var listSize = new Coords
		(
			(size.x - margin * 3) / 2, 150, 0
		); 

		var defns = universe.world.defn;
		var skillLearner = this;
		var skillsAll = defns.defnArraysByTypeName.get(Skill.name); // todo - Just use the -ByName lookup.
		var skillsAllByName = defns.defnsByNameByTypeName.get(Skill.name);

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
					null, null,
					DataBinding.fromContext(true), // isEnabled
					null, null
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
						(c: SkillLearner) =>
						{
							return c.skillsAvailableToLearn(skillsAll);
						},
						null
					),
					new DataBinding
					(
						null, (c: Skill) => c.name, null
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
					DataBinding.fromContext(true), // isEnabled
					(u: Universe) => 
					{
						skillLearner.skillBeingLearnedName =
							skillLearner.skillSelectedName;
					}, // confirm
					null
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
						this, (c: SkillLearner) => (c.skillSelectedName || "-"), null
					),
					null
				),

				new ControlLabel
				(
					"labelSkillSelectedDescription", // name,
					new Coords(margin, 232, 0), // pos,
					new Coords(size.x - margin * 2, labelHeight, 0), // size,
					false, // isTextCentered,
					new DataBinding
					(
						this,
						(c: SkillLearner) =>
						{
							var skill = c.skillSelected(skillsAllByName);
							return (skill == null ? "-" : skill.description);
						},
						null
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
					new Coords(145, size.y - margin - labelHeight * 2, 0), // pos,
					new Coords(size.x - margin * 2, labelHeight, 0), // size,
					false, // isTextCentered,
					new DataBinding
					(
						this,
						(c: SkillLearner) =>
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
					new Coords(145, size.y - margin - labelHeight, 0), // pos,
					new Coords(30, labelHeight, 0), // size,
					false, // isTextCentered,
					new DataBinding
					(
						this,
						(c: SkillLearner) => c.learningAccumulatedOverRequired(skillsAllByName),
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
	}
}

}
