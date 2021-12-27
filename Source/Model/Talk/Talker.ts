
namespace ThisCouldBeBetter.GameFramework
{

export class Talker implements EntityProperty<Talker>
{
	conversationDefnName: string;
	quit: () => void;

	constructor(conversationDefnName: string, quit: () => void)
	{
		this.conversationDefnName = conversationDefnName;
		this.quit = quit;
	}

	static fromConversationDefnName(conversationDefnName: string): Talker
	{
		return new Talker(conversationDefnName, null);
	}

	talk(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;
		var entityTalker = uwpe.entity;
		var entityTalkee = uwpe.entity2;

		var conversationDefnAsJSON =
			universe.mediaLibrary.textStringGetByName(this.conversationDefnName).value;
		var conversationDefn = ConversationDefn.deserialize(conversationDefnAsJSON);
		var conversationQuit = this.quit;
		if (conversationQuit == null)
		{
			var venueToReturnTo = universe.venueCurrent;
			conversationQuit = () => // quit
			{
				universe.venueNext = venueToReturnTo;
			};
		}
		var conversation = new ConversationRun
		(
			conversationDefn,
			conversationQuit,
			entityTalkee,
			entityTalker, // entityTalker
			null // contentsById
		);
		var conversationSize = universe.display.sizeDefault().clone();
		var conversationAsControl =
			conversation.toControl(conversationSize, universe);

		var venueNext = conversationAsControl.toVenue();

		universe.venueNext = venueNext;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Talker): boolean { return false; } // todo

}

}
