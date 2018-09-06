
// classes

function ConversationDefn(name, talkNodeDefns, talkNodes)
{
	this.name = name;
	this.talkNodeDefns = talkNodeDefns.addLookups("name");
	this.talkNodes = talkNodes.addLookups("name");
}

{
	ConversationDefn.prototype.talkNodeByName = function(nameOfTalkNodeToGet)
	{
		return this.talkNodes[nameOfTalkNodeToGet];
	}

	ConversationDefn.prototype.talkNodesByNames = function(namesOfTalkNodesToGet)
	{
		var returnNodes = [];

		for (var i = 0; i < namesOfTalkNodesToGet.length; i++)
		{
			var nameOfTalkNodeToGet = namesOfTalkNodesToGet[i];
			var talkNode = this.talkNodeByName(nameOfTalkNodeToGet);
			returnNodes.push(talkNode);
		}

		return returnNodes;
	}

	// serialization

	ConversationDefn.deserialize = function(conversationDefnAsJSON)
	{
		var conversationDefn = JSON.parse(conversationDefnAsJSON);

		conversationDefn.__proto__ = ConversationDefn.prototype;

		var talkNodes = conversationDefn.talkNodes;
		for (var i = 0; i < talkNodes.length; i++)
		{
			var talkNode = talkNodes[i];
			talkNode.__proto__ = TalkNode.prototype;
			if (talkNode.name == null)
			{
				talkNode.name = TalkNode.idNext();
			}
			if (talkNode.isActive == null)
			{
				talkNode.isActive = true;
			}
			/*
			if (talkNode.defnName == "Script")
			{
				var scriptAsString = "(" + talkNode.parameters + ")";
				talkNode.parameters = eval(scriptAsString);
			}
			*/
		}
		talkNodes.addLookups("name");

		conversationDefn.talkNodeDefns = TalkNodeDefn.Instances()._All;

		return conversationDefn;
	}

	ConversationDefn.prototype.serialize = function()
	{
		var talkNodeDefnsToRestore = this.talkNodeDefns;
		delete this.talkNodeDefns;

		var returnValue = JSON.stringify(this, null, 4);

		this.talkNodeDefns = talkNodeDefnsToRestore;
		return returnValue;
	}
}
