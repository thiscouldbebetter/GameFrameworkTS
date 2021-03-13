
namespace ThisCouldBeBetter.GameFramework
{

export class Skill
{
	name: string;
	learningRequired: number;
	namesOfPrerequisiteSkills: string[];
	description: string;

	constructor
	(
		name: string,
		learningRequired: number,
		namesOfPrerequisiteSkills: string[],
		description: string
	)
	{
		this.name = name;
		this.learningRequired = learningRequired;
		this.namesOfPrerequisiteSkills = namesOfPrerequisiteSkills;
		this.description = description;
	}

	static skillsDemo()
	{
		var returnValues =
		[
			// Skill(name, cost, prerequisites, description)

			new Skill
			(
				"Jumping", 4, [],
				"A jump.  Upwards.  Into the air."
			),
			new Skill
			(
				"Running", 4, [],
				"Like walking, but faster and harder."
			),
			new Skill
			(
				"Sneaking", 4, [],
				"Like walking, but slower and quieter."
			),
			new Skill
			(
				"Strafing", 4, [],
				"Like walking, but sideways."
			),

			new Skill
			(
				"Hiding", 8, [ "Running" ],
				"Like standing, but less noticable."
			),
			new Skill
			(
				"JumpingHigher", 8, [ "Jumping" ],
				"Like jumping, but higher."
			),
			new Skill
			(
				"RunningFaster", 8, [ "Running" ],
				"Like running, but faster." 
			),

			new Skill
			(
				"Dashing", 16, [ "RunningFaster", "JumpingHigher" ],
				"Like running, but less civic-minded."
			),

			new Skill
			(
				"HidingLonger", 16, [ "Hiding" ],
				"Like hiding, but longer."
			),

			new Skill
			(
				"Teleporting", 32, [ "Dashing", "HidingLonger" ],
				"Fzamph!  Now you're over here."
			),
		];

		return returnValues;
	}
}

}
