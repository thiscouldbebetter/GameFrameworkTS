
// classes

class ConversationDefn
{
	name: string;
	visualPortrait: Visual;
	contentTextStringName: string;
	talkNodeDefns: TalkNodeDefn[];
	talkNodeDefnsByName: Map<string, TalkNodeDefn>;
	talkNodes: TalkNode[];
	talkNodesByName: Map<string, TalkNode>;

	constructor(name: string, visualPortrait: Visual, contentTextStringName: string, talkNodeDefns: TalkNodeDefn[], talkNodes: TalkNode[])
	{
		this.name = name;
		this.visualPortrait = visualPortrait;
		this.contentTextStringName = contentTextStringName;
		this.talkNodeDefns = talkNodeDefns;
		this.talkNodeDefnsByName = ArrayHelper.addLookupsByName(this.talkNodeDefns);
		this.talkNodes = talkNodes;
		this.talkNodesByName = ArrayHelper.addLookupsByName(this.talkNodes);
	}

	talkNodeByName(nameOfTalkNodeToGet: string)
	{
		return this.talkNodesByName.get(nameOfTalkNodeToGet);
	}

	talkNodesByNames(namesOfTalkNodesToGet: string[])
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

	expandFromContentTextString(contentTextString: TextString)
	{
		var contentText = contentTextString.value;
		var contentTextAsLines = contentText.split("\n");
		var tagToTextLinesLookup = new Map<string,string[]>([]);
		var tagCurrent: string = null;
		var linesForTagCurrent: string[];
		for (var i = 0; i < contentTextAsLines.length; i++)
		{
			var contentLine = contentTextAsLines[i];
			if (contentLine.startsWith("#"))
			{
				if (tagCurrent != null)
				{
					tagToTextLinesLookup.set(tagCurrent, linesForTagCurrent);
				}
				tagCurrent = contentLine.split("\t")[0];
				linesForTagCurrent = [];
			}
			else
			{
				if (contentLine.length > 0)
				{
					linesForTagCurrent.push(contentLine);
				}
			}
		}
		tagToTextLinesLookup.set(tagCurrent, linesForTagCurrent);

		var talkNodeDefns = TalkNodeDefn.Instances()._AllByName;
		var talkNodeDefnNamesToExpand =
		[
			talkNodeDefns.get("Display").name,
			talkNodeDefns.get("Option").name,
		];

		var talkNodesExpanded = [];
		for (var i = 0; i < this.talkNodes.length; i++)
		{
			var talkNodeToExpand = this.talkNodes[i];

			var talkNodeToExpandDefnName = talkNodeToExpand.defnName;
			var shouldTalkNodeBeExpanded =
				talkNodeDefnNamesToExpand.some(x => x == talkNodeToExpandDefnName);
			if (shouldTalkNodeBeExpanded == false)
			{
				talkNodesExpanded.push(talkNodeToExpand);
			}
			else
			{
				var tag = talkNodeToExpand.text;
				var textLinesForTag = tagToTextLinesLookup.get(tag);
				for (var j = 0; j < textLinesForTag.length; j++)
				{
					var textLine = textLinesForTag[j];
					var talkNodeExpanded = new TalkNode
					(
						talkNodeToExpand.name + "_" + j,
						talkNodeToExpandDefnName,
						textLine,
						talkNodeToExpand.next,
						talkNodeToExpand.isActive
					);
					talkNodesExpanded.push(talkNodeExpanded);
				}
			}
		}

		this.talkNodes = talkNodesExpanded;
		this.talkNodesByName = ArrayHelper.addLookupsByName(this.talkNodes);
	};

	// serialization

	static deserialize(conversationDefnAsJSON: string)
	{
		var conversationDefn = JSON.parse(conversationDefnAsJSON);

		// Additional processing to support minification.
		conversationDefn.name = conversationDefn["name"];
		var imagePortraitName = conversationDefn["imagePortraitName"];
		if (imagePortraitName == null)
		{
			conversationDefn.visualPortrait = new VisualNone();
		}
		else
		{
			conversationDefn.visualPortrait = new VisualImageFromLibrary(imagePortraitName);
		}
		conversationDefn.contentTextStringName =
			conversationDefn["contentTextStringName"];

		var talkNodes = conversationDefn["talkNodes"];
		for (var i = 0; i < talkNodes.length; i++)
		{
			var talkNode = talkNodes[i];
			talkNode.name = talkNode["name"];
			talkNode.defnName = talkNode["defnName"];
			talkNode.text = talkNode["text"];
			talkNode.next = talkNode["next"];
			talkNode.isActive = talkNode["isActive"];
		}

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
		}
		conversationDefn.talkNodes = talkNodes;
		conversationDefn.talkNodesByName = ArrayHelper.addLookupsByName(talkNodes);

		conversationDefn.talkNodeDefns = TalkNodeDefn.Instances()._All;
		conversationDefn.talkNodeDefnsByName =
			ArrayHelper.addLookupsByName(conversationDefn.talkNodeDefns);

		return conversationDefn;
	};

	serialize()
	{
		var talkNodeDefnsToRestore = this.talkNodeDefns;
		delete this.talkNodeDefns;

		var returnValue = JSON.stringify(this, null, 4);

		this.talkNodeDefns = talkNodeDefnsToRestore;
		return returnValue;
	};
}
