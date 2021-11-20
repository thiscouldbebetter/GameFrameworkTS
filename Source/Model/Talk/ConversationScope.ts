
namespace ThisCouldBeBetter.GameFramework
{

export class ConversationScope
{
	parent: ConversationScope;
	talkNodeCurrent: TalkNode;
	talkNodesForOptions: TalkNode[];
	talkNodesForOptionsByName: Map<string, TalkNode>;

	displayTextCurrent: string;
	haveOptionsBeenUpdated: boolean;
	isPromptingForResponse: boolean;
	talkNodeForOptionSelected: TalkNode;

	_talkNodesForOptionsActive: TalkNode[];
	_emptyArray: TalkNode[];

	constructor
	(
		parent: ConversationScope,
		talkNodeCurrent: TalkNode,
		talkNodesForOptions: TalkNode[]
	)
	{
		this.parent = parent;
		this.talkNodeCurrent = talkNodeCurrent;
		this.isPromptingForResponse = false;
		this.talkNodesForOptions = talkNodesForOptions;
		this.talkNodesForOptionsByName =
			ArrayHelper.addLookupsByName(this.talkNodesForOptions);

		this.displayTextCurrent = "[conversation begins]";
		this.talkNodeForOptionSelected = null;
		this._talkNodesForOptionsActive = [];
		this._emptyArray = [];
		this.haveOptionsBeenUpdated = true;
	}

	talkNodeAdvance(conversationRun: ConversationRun): ConversationScope
	{
		var conversationDefn = conversationRun.defn;
		var defnTalkNodes = conversationDefn.talkNodes;
		var talkNodeIndex = defnTalkNodes.indexOf(this.talkNodeCurrent);
		var talkNodeNext = defnTalkNodes[talkNodeIndex + 1];
		this.talkNodeCurrent = talkNodeNext;
		return this;
	}

	talkNodesForOptionsActive(): TalkNode[]
	{
		var returnValues;
		if (this.isPromptingForResponse == false)
		{
			returnValues = this._emptyArray;
		}
		else
		{
			if (this.haveOptionsBeenUpdated)
			{
				this.haveOptionsBeenUpdated = false;
				this._talkNodesForOptionsActive.length = 0;

				for (var i = 0; i < this.talkNodesForOptions.length; i++)
				{
					var talkNode = this.talkNodesForOptions[i];
					if (talkNode.isActive)
					{
						this._talkNodesForOptionsActive.push(talkNode);
					}
				}
			}

			returnValues = this._talkNodesForOptionsActive;
		}

		return returnValues;
	}

	update(universe: Universe, conversationRun: ConversationRun): void
	{
		this.haveOptionsBeenUpdated = true;
		this.talkNodeCurrent.execute(universe, conversationRun, this);
	}
}

}
