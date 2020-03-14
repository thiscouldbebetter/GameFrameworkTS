
function TalkNode(name, defnName, text, next, isActive)
{
	this.name = (name == null ? TalkNode.idNext() : name);
	this.defnName = defnName;
	this.text = text;
	this.next = next;
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
	};

	// instance methods

	TalkNode.prototype.activate = function(conversationRun, scope)
	{
		var defn = this.defn(conversationRun.defn);
		if (defn.activate != null)
		{
			defn.activate(conversationRun, scope, this);
		}
	};

	TalkNode.prototype.defn = function(conversationDefn)
	{
		return conversationDefn.talkNodeDefns[this.defnName];
	};

	TalkNode.prototype.execute = function(universe, conversationRun, scope)
	{
		var defn = this.defn(conversationRun.defn);
		defn.execute(universe, conversationRun, scope, this);
	};

	TalkNode.prototype.textForTranscript = function(conversationDefn)
	{
		var speakerName = (this.defnName == "Option" ? "YOU" : "THEY" );
		var returnValue = speakerName + ": " + this.text;
		return returnValue;
	};
}
