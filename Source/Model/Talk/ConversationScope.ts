
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

		this.displayTextCurrent = null;
		this.talkNodeForOptionSelected = null;
		this._talkNodesForOptionsActive = [];
		this._emptyArray = [];
		this.haveOptionsBeenUpdated = true;
	}

	node(): TalkNode
	{
		// Tersely named convenience method for scripts.
		return this.talkNodeForOptionSelected;
	}

	optionSelectByNext(nextToMatch: string): TalkNode
	{
		if (this.talkNodesForOptions.length > 0)
		{
			var optionToSelect = this.talkNodesForOptions.find(x => x.next == nextToMatch);

			var indexToSelect =
				this.talkNodesForOptions.indexOf(optionToSelect);

			if (indexToSelect == -1)
			{
				this.talkNodeForOptionSelected = null;
			}
			else
			{
				this.talkNodeForOptionSelected =
					this.talkNodesForOptions[indexToSelect];
			}
		}

		return this.talkNodeForOptionSelected;
	}

	optionSelectNext(): TalkNode
	{
		if (this.talkNodesForOptions.length > 0)
		{
			var indexSelected =
				this.talkNodesForOptions.indexOf(this.talkNodeForOptionSelected);

			indexSelected++;
			if (indexSelected > this.talkNodesForOptions.length)
			{
				indexSelected = 0;
			}

			this.talkNodeForOptionSelected =
				this.talkNodesForOptions[indexSelected];
		}

		return this.talkNodeForOptionSelected;
	}

	talkNodeAdvance
	(
		universe: Universe,
		conversationRun: ConversationRun
	): ConversationScope
	{
		var conversationDefn = conversationRun.defn;
		var defnTalkNodes = conversationDefn.talkNodes;
		var talkNodeInitial = this.talkNodeCurrent;
		while
		(
			this.talkNodeCurrent != null
			&&
			(
				this.talkNodeCurrent == talkNodeInitial
				|| this.talkNodeCurrent.isEnabled(universe, conversationRun) == false
			)
		)
		{
			var talkNodeIndex = defnTalkNodes.indexOf(this.talkNodeCurrent);
			var talkNodeNext = defnTalkNodes[talkNodeIndex + 1];
			this.talkNodeCurrent = talkNodeNext;
		}
		return this;
	}

	talkNodeNextSpecifiedOrAdvance
	(
		universe: Universe,
		conversationRun: ConversationRun
	): TalkNode
	{
		var conversationDefn = conversationRun.defn;
		var nodeNextNameSpecified = this.talkNodeCurrent.next;
		if (nodeNextNameSpecified == null)
		{
			this.talkNodeAdvance(universe, conversationRun);
		}
		else
		{
			this.talkNodeCurrent =
				conversationDefn.talkNodeByName(nodeNextNameSpecified);
		}

		return this.talkNodeCurrent;
	}

	talkNodesForOptionsActive
	(
		universe: Universe, conversationRun: ConversationRun
	): TalkNode[]
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
					var isEnabled = talkNode.isEnabled(universe, conversationRun);
					if (isEnabled)
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
		if (this.talkNodeCurrent != null)
		{
			this.talkNodeCurrent.execute(universe, conversationRun, this);
		}
	}
}

}
