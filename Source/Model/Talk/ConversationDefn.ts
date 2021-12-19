
namespace ThisCouldBeBetter.GameFramework
{

export class ConversationDefn
{
	name: string;
	visualPortrait: VisualBase;
	talkNodeDefns: TalkNodeDefn[];
	talkNodes: TalkNode[];

	talkNodeDefnsByName: Map<string, TalkNodeDefn>;
	talkNodesByName: Map<string, TalkNode>;

	constructor
	(
		name: string,
		visualPortrait: VisualBase,
		talkNodeDefns: TalkNodeDefn[],
		talkNodes: TalkNode[]
	)
	{
		this.name = name;
		this.visualPortrait = visualPortrait;
		this.talkNodeDefns = talkNodeDefns;
		this.talkNodeDefnsByName = ArrayHelper.addLookupsByName(this.talkNodeDefns);
		this.talkNodes = talkNodes;
		this.talkNodesByName = ArrayHelper.addLookupsByName(this.talkNodes);
	}

	contentSubstitute(contentByNodeName: Map<string, string>): ConversationDefn
	{
		this.talkNodes.forEach(talkNode =>
		{
			var talkNodeName = talkNode.name;
			if (talkNodeName != null)
			{
				if (contentByNodeName.has(talkNodeName))
				{
					talkNode.content = contentByNodeName.get(talkNodeName);
				}
			}
		});
		return this;
	}

	talkNodeByName(nameOfTalkNodeToGet: string): TalkNode
	{
		return this.talkNodesByName.get(nameOfTalkNodeToGet);
	}

	talkNodesByNames(namesOfTalkNodesToGet: string[]): TalkNode[]
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

	expandFromContentTextString(contentTextString: TextString): void
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
				throw new Error("todo");

				var tag = talkNodeToExpand.content;
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
						talkNodeToExpand.isDisabled
					);
					talkNodesExpanded.push(talkNodeExpanded);
				}
			}
		}

		this.talkNodes = talkNodesExpanded;
		this.talkNodesByName = ArrayHelper.addLookupsByName(this.talkNodes);
	}

	// Clonable.

	clone(): ConversationDefn
	{
		return new ConversationDefn
		(
			this.name,
			this.visualPortrait,
			this.talkNodeDefns.map(x => x.clone()),
			this.talkNodes.map(x => x.clone())
		)
	}


	// Serialization.

	static deserialize(conversationDefnAsJSON: string): ConversationDefn
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

		var talkNodes = conversationDefn["talkNodes"];
		for (var i = 0; i < talkNodes.length; i++)
		{
			var talkNode = talkNodes[i];
			/*
			talkNode.name = talkNode["name"];
			talkNode.defnName = talkNode["defnName"];
			talkNode.text = talkNode["text"];
			talkNode.next = talkNode["next"];
			talkNode.isDisabled = talkNode["isDisabled"];
			*/

			Object.setPrototypeOf(talkNode, TalkNode.prototype);
		}

		Object.setPrototypeOf(conversationDefn, ConversationDefn.prototype);

		var talkNodes = conversationDefn.talkNodes;
		for (var i = 0; i < talkNodes.length; i++)
		{
			var talkNode = talkNodes[i];

			if (talkNode.name == null)
			{
				talkNode.name = TalkNode.idNext();
			}
		}
		conversationDefn.talkNodes = talkNodes;

		/*
		conversationDefn.talkNodesByName = ArrayHelper.addLookupsByName(talkNodes);
		conversationDefn.talkNodeDefnsByName =
			ArrayHelper.addLookupsByName(conversationDefn.talkNodeDefns);
		*/

		conversationDefn.talkNodeDefns = TalkNodeDefn.Instances()._All;

		conversationDefn = conversationDefn.clone(); // hack

		return conversationDefn;
	}

	serialize(): string
	{
		var talkNodeDefnsToRestore = this.talkNodeDefns;
		delete this.talkNodeDefns;

		var returnValue = JSON.stringify(this, null, 4);

		this.talkNodeDefns = talkNodeDefnsToRestore;
		return returnValue;
	}
}

}
