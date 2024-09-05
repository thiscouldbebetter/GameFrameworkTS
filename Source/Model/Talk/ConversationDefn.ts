
namespace ThisCouldBeBetter.GameFramework
{

export class ConversationDefn
{
	name: string;
	contentTextStringName: string;
	visualPortrait: VisualBase;
	soundMusicName: string;
	talkNodeDefns: TalkNodeDefn[];
	talkNodes: TalkNode[];

	talkNodeDefnsByName: Map<string, TalkNodeDefn>;
	talkNodesByName: Map<string, TalkNode>;

	constructor
	(
		name: string,
		contentTextStringName: string,
		visualPortrait: VisualBase,
		soundMusicName: string,
		talkNodeDefns: TalkNodeDefn[],
		talkNodes: TalkNode[]
	)
	{
		this.name = name;
		this.contentTextStringName = contentTextStringName;
		this.visualPortrait = visualPortrait;
		this.soundMusicName = soundMusicName;
		this.talkNodeDefns = talkNodeDefns;
		this.talkNodeDefnsByName = ArrayHelper.addLookupsByName(this.talkNodeDefns);
		this.talkNodes = talkNodes;
		this.talkNodesByName = ArrayHelper.addLookupsByName(this.talkNodes);

		var validationErrors = this.validateAndReturnErrors();
		if (validationErrors.length > 0)
		{
			var errorMessage =
				"ConversationDefn '" + this.name + "'is not valid: " + validationErrors.join("; ") + "."
			throw new Error(errorMessage);
		}
	}

	contentSubstitute(contentByNodeName: Map<string, string>): ConversationDefn
	{
		this.talkNodes.forEach(talkNode =>
		{
			var talkNodeName = talkNode.name;
			if
			(
				talkNodeName != null
				&& talkNodeName.startsWith("_") == false
				&& contentByNodeName.has(talkNodeName)
			)
			{
				talkNode.content = contentByNodeName.get(talkNodeName);
			}
			else if (contentByNodeName.has(talkNode.content))
			{
				talkNode.content = contentByNodeName.get(talkNode.content);
			}
		});
		return this;
	}

	displayNodesExpandByLines(): ConversationDefn
	{
		var defnNameDisplay =
			TalkNodeDefn.Instances().Display.name;

		for (var i = 0; i < this.talkNodes.length; i++)
		{
			var talkNode = this.talkNodes[i];
			if (talkNode.defnName == defnNameDisplay)
			{
				var content = talkNode.content;
				var contentAsLines = content.split("\n");
				if (contentAsLines.length > 0)
				{
					talkNode.content = contentAsLines[0];

					var linesAfterFirst =
						contentAsLines.slice(1);
					var linesAsDisplayNodes = linesAfterFirst.map
					(
						x => TalkNode.display(null, x)
					);
					for (var j = 0; j < linesAsDisplayNodes.length; j++)
					{
						var nodeNew = linesAsDisplayNodes[j];
						this.talkNodes.splice(i + j + 1, 0, nodeNew);
					}

					i += linesAsDisplayNodes.length;
				}
			}
		}

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

	validateAndReturnErrors(): string[]
	{
		var errorsSoFar = [];

		var nodes = this.talkNodes;

		var nodesWithUnrecognizedTypes =
			nodes.filter(x => this.talkNodeDefnsByName.has(x.defnName) == false);

		if (nodesWithUnrecognizedTypes.length > 0)
		{
			var defnNamesUnrecognized = nodesWithUnrecognizedTypes.map(x => x.defnName);
			var error = "one or more nodes have unrecognized types: " + defnNamesUnrecognized.join(", ");
			errorsSoFar.push(error);
		}

		var nodesWithNextFieldsThatDoNotCorrespondToNamesOfOtherNodes =
			nodes.filter
			(
				x =>
					x.defnName.startsWith("Variable") == false // Some of these use the next field to store a script.
					&& x.next != null
					&& nodes.some(y => y.name == x.next) == false
			);

		if (nodesWithNextFieldsThatDoNotCorrespondToNamesOfOtherNodes.length > 0)
		{
			var nextFieldsThatDoNotMatch =
				nodesWithNextFieldsThatDoNotCorrespondToNamesOfOtherNodes.map(x => x.next);

			var error =
				"one or more nodes have next fields that do not correspond to the name of some other node: "
				+ nextFieldsThatDoNotMatch.join(", ");
			errorsSoFar.push(error);
		}

		return errorsSoFar;
	}

	// Content expansion.

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
						talkNodeToExpand._isDisabled
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
		var talkNodeDefnsCloned = this.talkNodeDefns.map(x => x.clone());
		var talkNodesCloned = this.talkNodes.map(x => x.clone());
		return new ConversationDefn
		(
			this.name,
			this.contentTextStringName,
			this.visualPortrait,
			this.soundMusicName,
			talkNodeDefnsCloned,
			talkNodesCloned
		)
	}

	// Serialization.

	static deserialize(conversationDefnAsText: string): ConversationDefn
	{
		var returnValue: ConversationDefn;

		try
		{
			returnValue = ConversationDefn.fromJson(conversationDefnAsText);
		}
		catch (err)
		{
			returnValue = ConversationDefn.fromPipeSeparatedValues(conversationDefnAsText);
		}

		return returnValue;
	}

	static fromPipeSeparatedValues(conversationDefnAsPsv: string): ConversationDefn
	{
		var newline = "\n";

		conversationDefnAsPsv = conversationDefnAsPsv.split("\r\n").join(newline);

		var blankLine = newline + newline;
		var indexOfFirstBlankLine = conversationDefnAsPsv.indexOf(blankLine);
		var header = conversationDefnAsPsv.substr(0, indexOfFirstBlankLine);
		var body = conversationDefnAsPsv.substr(indexOfFirstBlankLine);

		var conversationDefnName: string;
		var contentTextStringName: string;
		var imagePortraitName: string;
		var soundMusicName: string;
		var headerLines = header.split(newline);
		for (var i = 0; i < headerLines.length; i++)
		{
			var headerLine = headerLines[i];
			var fieldNameAndValue = headerLine.split("=");
			var fieldName = fieldNameAndValue[0];
			var fieldValue = fieldNameAndValue[1];

			if (fieldName == "name")
			{
				conversationDefnName = fieldValue;
			}
			else if (fieldName == "contentTextStringName")
			{
				contentTextStringName = fieldValue;
			}
			else if (fieldName == "imagePortraitName")
			{
				imagePortraitName = fieldValue;
			}
			else if (fieldName == "soundMusicName")
			{
				soundMusicName = fieldValue;
			}
			else
			{
				// Ignore it.
			}
		}

		var visualPortrait = new VisualImageFromLibrary(imagePortraitName);

		var bodyLines = body.split(newline);
		var bodyLinesMinusComments =
			bodyLines.map(x => x.split("//")[0]);
		var bodyLinesNonBlank =
			bodyLinesMinusComments.filter(x => x.trim().length > 0);
		var bodyLinesAsTalkNodes =
			bodyLinesNonBlank.map(x => TalkNode.fromLinePipeSeparatedValues(x) );

		var talkNodeDefns = TalkNodeDefn.Instances()._All;

		var returnValue = new ConversationDefn
		(
			conversationDefnName,
			contentTextStringName,
			visualPortrait, // todo
			soundMusicName,
			talkNodeDefns,
			bodyLinesAsTalkNodes
		);

		return returnValue;
	}

	static fromJson(conversationDefnAsJson: string): ConversationDefn
	{
		var conversationDefn = JSON.parse(conversationDefnAsJson);

		// Additional processing to support minification.
		conversationDefn.name = conversationDefn["name"];
		conversationDefn.contentTextStringName = conversationDefn["contentTextStringName"];

		var imagePortraitName = conversationDefn["imagePortraitName"];
		if (imagePortraitName == null)
		{
			conversationDefn.visualPortrait = new VisualNone();
		}
		else
		{
			conversationDefn.visualPortrait = new VisualImageFromLibrary(imagePortraitName);
		}

		var soundMusicName = conversationDefn["soundMusicName"];
		if (soundMusicName == null)
		{
			conversationDefn.soundMusic = new SoundNone();
		}
		else
		{
			conversationDefn.soundMusic = new SoundFromLibrary(soundMusicName);
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

			if (talkNode.isDisabled != null)
			{
				var scriptToRunAsString = "( (u, cr) => " + talkNode.isDisabled + " )";
				var scriptToRun = eval(scriptToRunAsString);

				talkNode._isDisabled = scriptToRun;
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
