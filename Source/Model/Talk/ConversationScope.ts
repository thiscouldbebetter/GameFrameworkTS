
namespace ThisCouldBeBetter.GameFramework
{

export class ConversationScope
{
	parent: ConversationScope;
	_talkNodeCurrent: TalkNode;
	_talkNodePrev: TalkNode;
	talkNodesForOptions: TalkNode[];
	talkNodesForOptionsByName: Map<string, TalkNode>;

	displayLineIndexCurrent: number;
	displayLinesCurrent: string[];
	haveOptionsBeenUpdated: boolean;
	isPromptingForResponse: boolean;
	talkNodeForOptionSelected: TalkNode;

	_talkNodesForOptionsActive: TalkNode[];
	_emptyArray: TalkNode[];

	constructor
	(
		parent: ConversationScope,
		talkNodeInitial: TalkNode,
		talkNodesForOptions: TalkNode[]
	)
	{
		this.parent = parent;
		this.talkNodeCurrentSet(talkNodeInitial);
		this.isPromptingForResponse = false;
		this.talkNodesForOptions = talkNodesForOptions || [];
		this.talkNodesForOptionsByName =
			ArrayHelper.addLookupsByName(this.talkNodesForOptions);

		this.displayLinesCurrent = null;
		this.displayLineIndexCurrent = null;
		this.talkNodeForOptionSelected = null;
		this._talkNodesForOptionsActive = [];
		this._emptyArray = [];
		this.haveOptionsBeenUpdated = true;
	}

	static fromTalkNodeInitial(talkNodeInitial: TalkNode): ConversationScope
	{
		return new ConversationScope(null, talkNodeInitial, null);
	}

	displayTextCurrent(): string
	{
		var returnValue =
		(
			this.displayLineIndexCurrent == null
			? null
			: this.displayLinesCurrent[this.displayLineIndexCurrent]
		);
		return returnValue;
	}

	displayTextCurrentAdvance(): void
	{
		if (this.displayLineIndexCurrent == null)
		{
			this.displayLineIndexCurrent = 0;
		}
		else
		{
			this.displayLineIndexCurrent++;
		}

		if (this.displayLineIndexCurrent >= this.displayLinesCurrent.length)
		{
			this.displayLineIndexCurrent = null;
		}
	}


	node(): TalkNode
	{
		// Tersely named convenience method for scripts.
		return this.talkNodeForOptionSelected;
	}

	optionSelectByName(nameToMatch: string): TalkNode
	{
		if (this.talkNodesForOptions.length > 0)
		{
			var optionToSelect =
				this.talkNodesForOptions.find(x => x.name == nameToMatch);

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

	optionSelectByNext(nextToMatch: string): TalkNode
	{
		if (this.talkNodesForOptions.length > 0)
		{
			var optionToSelect =
				this.talkNodesForOptions.find(x => x.next == nextToMatch);

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
		var nodeInitial = this.talkNodeCurrent();
		var nodeCurrent = nodeInitial;

		var nodeCurrentIsInitialOrDisabled =
			nodeCurrent != null
			&&
			(
				nodeCurrent == nodeInitial
				|| nodeCurrent.isDisabled(universe, conversationRun)
			);

		while(nodeCurrentIsInitialOrDisabled)
		{
			var talkNodeIndex = defnTalkNodes.indexOf(nodeCurrent);
			var talkNodeNext = defnTalkNodes[talkNodeIndex + 1];
			this.talkNodeCurrentSet(talkNodeNext);

			nodeCurrent = this.talkNodeCurrent();

			nodeCurrentIsInitialOrDisabled =
				nodeCurrent != null
				&&
				(
					nodeCurrent == nodeInitial
					|| nodeCurrent.isDisabled(universe, conversationRun)
				);
		}

		return this;
	}

	talkNodeCurrent(): TalkNode
	{
		return this._talkNodeCurrent;
	}

	talkNodeCurrentExecute(universe: Universe, conversationRun: ConversationRun): void
	{
		this.haveOptionsBeenUpdated = true;
		var nodeCurrent = this.talkNodeCurrent();
		if (nodeCurrent != null)
		{
			nodeCurrent.execute(universe, conversationRun, this);
		}
	}

	talkNodeCurrentSet(value: TalkNode): void
	{
		//Assert.isNotNull(value);
		this._talkNodePrev = this._talkNodeCurrent;
		this._talkNodeCurrent = value;
	}

	talkNodeGoToNext
	(
		universe: Universe,
		conversationRun: ConversationRun
	): TalkNode
	{
		var conversationDefn = conversationRun.defn;
		var nodeNextNameSpecified = this.talkNodeCurrent().next;
		if (nodeNextNameSpecified == null)
		{
			this.talkNodeAdvance(universe, conversationRun);
		}
		else
		{
			var nodeNext = conversationDefn.talkNodeByName(nodeNextNameSpecified);
			this.talkNodeCurrentSet(nodeNext);
		}

		return this.talkNodeCurrent();
	}

	talkNodePrev(): TalkNode
	{
		return this._talkNodePrev;
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

	// String.

	toString(universe: Universe, conversationRun: ConversationRun): string
	{
		return this.toStringForUniverseAndConversationRun(universe, conversationRun);
	}

	toStringForUniverseAndConversationRun(universe: Universe, conversationRun: ConversationRun): string
	{
		var nodeCurrent = this.talkNodeCurrent();
		var nodeCurrentAsString = nodeCurrent.toString();

		var nodesForOptions = this.talkNodesForOptionsActive(universe, conversationRun);
		var nodesForOptionsAsString = nodesForOptions.map(x => x.toString() ).join("\n");

		var returnValue =
			nodeCurrentAsString
			+ "\n\n"
			+ nodesForOptionsAsString

		return returnValue;
	}
}

}
