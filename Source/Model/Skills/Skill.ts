
class Skill
{
	constructor(name, learningRequired, namesOfPrerequisiteSkills)
	{
		this.name = name;
		this.learningRequired = learningRequired;
		this.namesOfPrerequisiteSkills = namesOfPrerequisiteSkills;
	}

	static skillsDemo()
	{
		var returnValues =
		[
			// Skill(name, cost, prerequisites)

			new Skill("Jumping", 4, []),
			new Skill("Running", 4, []),
			new Skill("Strafing", 4, []),

			new Skill("Hiding", 8, [ "Running" ]),
			new Skill("JumpingHigher", 	8, [ "Jumping" ]),
			new Skill("RunningFaster", 	8, [ "Running" ]),

			new Skill("Dashing", 16, [ "RunningFaster", "JumpingHigher" ]),
			new Skill("HidingLonger", 16, [ "Hiding" ]),

			new Skill("Teleporting", 32, [ "Dashing", "HidingLonger" ]),
		];

		return returnValues;
	};

}
