
class ConversationScope
{
	constructor(parent, talkNodeCurrent, talkNodesForOptions)
	{
		this.parent = parent;
		this.talkNodeCurrent = talkNodeCurrent;
		this.isPromptingForResponse = false;
		this.talkNodesForOptions = talkNodesForOptions;

		this.displayTextCurrent = "[conversation begins]";
		this.talkNodeForOptionSelected = null;
		this._talkNodesForOptionsActive = [];
		this._emptyArray = [];
		this.haveOptionsBeenUpdated = true;
	}

	talkNodeAdvance(conversationRun)
	{
		var conversationDefn = conversationRun.defn;
		var defnTalkNodes = conversationDefn.talkNodes;
		var talkNodeIndex = defnTalkNodes.indexOf(this.talkNodeCurrent);
		var talkNodeNext = defnTalkNodes[talkNodeIndex + 1];
		this.talkNodeCurrent = talkNodeNext;
		return this;
	};

	talkNodesForOptionsActive()
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
	};

	update(universe, conversationRun)
	{
		this.haveOptionsBeenUpdated = true;
		this.talkNodeCurrent.execute(universe, conversationRun, this);
	};
}
