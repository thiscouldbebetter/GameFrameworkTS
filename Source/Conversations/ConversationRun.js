
function ConversationRun(defn)
{
	this.defn = defn;

	var talkNodeStart = this.defn.talkNodes[0];

	this.scopeCurrent = new ConversationScope
	(
		null, // parent
		talkNodeStart,
		// talkNodesForOptions
		[]
	);
	
	var d = document;
	d.getElementById("buttonNext").onclick = this.next.bind(this);
}

{
	// instance methods
	
	ConversationRun.prototype.next = function()
	{
		var d = document;
		var selectResponses = d.getElementById("selectResponses");
		var responseValueSelected = selectResponses.value;
		if (responseValueSelected != "")
		{
			var responseSelected = 
				this.scopeCurrent.talkNodesForOptions[responseValueSelected];
			responseSelected.activate(this, this.scopeCurrent);
		}
		this.update();
	}
				
	ConversationRun.prototype.update = function()
	{
		this.scopeCurrent.update(this);

		this.domElementUpdate();
	}
	
	// dom

	ConversationRun.prototype.domElementUpdate = function()
	{
		var d = document;
		
		var inputStatement = d.getElementById("inputStatement");
		inputStatement.value = this.scopeCurrent.displayTextCurrent;

		var selectResponses = d.getElementById("selectResponses");
		selectResponses.innerHTML = "";
		if (this.scopeCurrent.isPromptingForResponse == false)
		{
			d.getElementById("buttonNext").focus();
		}
		else
		{			
			var talkNodesForOptions = this.scopeCurrent.talkNodesForOptions;
			for (var i = 0; i < talkNodesForOptions.length; i++)
			{
				var talkNode = talkNodesForOptions[i];
				if (talkNode.isActive == true)
				{
					var talkNodeAsOption = d.createElement("option");
					talkNodeAsOption.innerHTML = talkNode.parameters[1];
					talkNodeAsOption.value = talkNode.name;
					selectResponses.appendChild(talkNodeAsOption);
				}
			}
			selectResponses.focus();
		}
	}
}
