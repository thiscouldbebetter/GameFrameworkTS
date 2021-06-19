
namespace ThisCouldBeBetter.GameFramework
{

export class Talker implements EntityProperty
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
		var conversation = new ConversationRun
		(
			conversationDefn,
			() => // quit
			{
				universe.venueNext = venueToReturnTo;
			},
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

}

}
