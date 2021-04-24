
namespace ThisCouldBeBetter.GameFramework
{

export class Talker implements EntityProperty
{
	conversationDefnName: string;

	constructor(conversationDefnName: string)
	{
		this.conversationDefnName = conversationDefnName;
	}

	talk
	(
		universe: Universe, world: World, place: Place,
		entityTalker: Entity, entityTalkee: Entity
	): void
	{
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

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}

}
