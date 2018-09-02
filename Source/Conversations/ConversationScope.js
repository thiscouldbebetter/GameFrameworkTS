
function ConversationScope(parent, talkNodeCurrent, talkNodesForOptions)
{
	this.parent = parent;
	this.talkNodeCurrent = talkNodeCurrent;
	this.isPromptingForResponse = false;
	this.talkNodesForOptions = talkNodesForOptions;

	this.displayTextCurrent = "[text]";
}

{
	ConversationScope.prototype.talkNodeAdvance = function(conversationRun)
	{
		var conversationDefn = conversationRun.defn;
		var defnTalkNodes = conversationDefn.talkNodes;
		var talkNodeIndex = defnTalkNodes.indexOf(this.talkNodeCurrent);
		var talkNodeNext = defnTalkNodes[talkNodeIndex + 1];
		this.talkNodeCurrent = talkNodeNext;
	}

	ConversationScope.prototype.update = function(conversationRun)
	{
		this.talkNodeCurrent.execute(conversationRun, this);	
	}
}
