
function TalkNode(name, defnName, parameters, isActive)
{
	this.name = (name == null ? TalkNode.idNext() : name);
	this.defnName = defnName;
	this.parameters = parameters;
	this.isActive = (isActive == null ? true : isActive);
}

{
	// static methods

	TalkNode._idNext = 0;
	TalkNode.idNext = function()
	{
		var returnValue = "_" + TalkNode._idNext;
		TalkNode._idNext++;
		return returnValue;
	}
	
	// instance methods

	TalkNode.prototype.activate = function(conversationRun, scope)
	{
		var defn = this.defn(conversationRun.defn);
		if (defn.activate != null)
		{
			defn.activate(conversationRun, scope, this);
		}
	}
	
	TalkNode.prototype.defn = function(conversationDefn)
	{
		return conversationDefn.talkNodeDefns[this.defnName];
	}

	TalkNode.prototype.execute = function(conversationRun, scope)
	{
		this.defn(conversationRun.defn).execute(conversationRun, scope, this);
	}
}
