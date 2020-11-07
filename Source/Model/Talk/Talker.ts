
class Talker extends EntityProperty
{
	conversationDefnName: string;

	constructor(conversationDefnName: string)
	{
		super();
		this.conversationDefnName = conversationDefnName;
	}

	talk(universe: Universe, world: World, place: Place, entityTalker: Entity, entityTalkee: Entity)
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

		var venueNext = new VenueControls(conversationAsControl, false);

		universe.venueNext = venueNext;
	}
}
