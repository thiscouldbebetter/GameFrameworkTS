
class Talker extends EntityProperty
{
	conversationDefnName: string;

	constructor(conversationDefnName: string)
	{
		super();
		this.conversationDefnName = conversationDefnName;
	}
}
