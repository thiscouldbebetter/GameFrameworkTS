
namespace ThisCouldBeBetter.GameFramework
{

export class Talker implements EntityProperty<Talker>
{
	conversationDefnName: string;

	constructor(conversationDefnName: string)
	{
		this.conversationDefnName = conversationDefnName;
	}

	talk(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;
		var entityTalker = uwpe.entity;
		var entityTalkee = uwpe.entity2;

		var conversationDefnAsJSON =
			universe.mediaLibrary.textStringGetByName(this.conversationDefnName).value;
		var conversationDefn = ConversationDefn.deserialize(conversationDefnAsJSON);
		var venueToReturnTo = universe.venueCurrent;
		var conversationQuit = () => // quit
		{
			universe.venueNext = venueToReturnTo;
		};
		var conversation = new ConversationRun
		(
			conversationDefn,
			conversationQuit,
			entityTalkee,
			entityTalker // entityTalker
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
