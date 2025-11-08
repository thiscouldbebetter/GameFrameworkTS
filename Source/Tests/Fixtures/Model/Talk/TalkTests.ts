
class TalkTests extends TestFixture
{
	constructor()
	{
		super(TalkTests.name);
	}

	tests(): Test[]
	{
		var returnTests =
		[
			Test.fromNameAndRunThen
			(
				"Talk",
				this.talk.bind(this)
			)
		];

		return returnTests;
	}

	// Tests.

	talk(testComplete: (testCompleted: Test) => void): void
	{
		var environment = new EnvironmentMock();
		environment.universeCreate
		(
			(u: Universe) =>
			{
				u.initialize
				(
					() => this.talk_UniverseInitialized(u, testComplete)
				)
			}
		);
	}

	talk_UniverseInitialized
	(
		universe: Universe,
		testComplete: (testCompleted: Test) => void
	): void
	{
		var methodsToRun =
		[
			this.talkToFriendly
		];

		methodsToRun.forEach
		(
			x =>
			{
				x.call(this, universe);
			}
		);

		testComplete(null);
	}

	talkToFriendly(universe: Universe): void
	{
		Assert.isNotNull(universe);

		var world = universe.world;

		var venueWorld = world.toVenue();
		universe.venueNextSet(venueWorld);

		var talker = Talker.fromConversationDefnName("Talk_Conversation_psv");
		this.talkToTalker
		(
			universe,
			talker,
			[
				// todo
			]
		);

		universe.stop();
	}

	talkToTalker(universe: Universe, talker: Talker, optionsToSelect: string[] ): void
	{
		var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);
		talker.talk(uwpe);

		this.waitUntilVenueCurrentIsConversation(universe);

		var conversationRun = talker.conversationRun;
		conversationRun.nextUntilPrompt(universe);

		for (var i = 0; i < optionsToSelect.length; i++)
		{
			var optionToSelect = optionsToSelect[i];
			if (optionToSelect == null)
			{
				conversationRun.optionSelectNext();
			}
			else
			{
				var optionFound = conversationRun.optionSelectByContentPartial(optionToSelect);
				if (optionFound == null)
				{
					throw new Error("No option found with content: " + optionToSelect);
				}
			}
			conversationRun.nextUntilPrompt(universe);
		}

		universe.updateForTimerTick();
	}

	waitForTicks(universe: Universe, ticksToWait: number): void
	{
		for (var i = 0; i < ticksToWait; i++)
		{
			universe.updateForTimerTick();
			universe.timerHelper.ticksSoFar++; // hack
		}
	}

	waitUntilVenueCurrentIsConversation(universe: Universe): void
	{
		while (universe.venue().constructor.name != VenueConversationRun.name)
		{
			this.waitForTicks(universe, 1);
		}
	}
}
