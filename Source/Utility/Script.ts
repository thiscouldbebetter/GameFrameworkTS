
namespace ThisCouldBeBetter.GameFramework
{

export class Script
{
	name: string;
	codeAsString: string;

	_codeAsFunction: any;

	constructor(name: string, codeAsString: string)
	{
		this.name = name;
		this.codeAsString = codeAsString;
	}

	static fromCodeAsString(codeAsString: string): Script
	{
		return new Script(null, codeAsString);
	}

	static fromFunction(codeAsFunction: any): Script
	{
		var script = new Script(null, null);
		script._codeAsFunction = codeAsFunction;
		return script;
	}

	codeAsFunction(): any
	{
		if (this._codeAsFunction == null)
		{
			this._codeAsFunction = eval(this.codeAsString);
			// It'd be nice to catch errors here,
			// but because of how eval() works,
			// it's seemingly not possible.
		}
		return this._codeAsFunction;
	}

	run(uwpe: UniverseWorldPlaceEntities): any
	{
		var codeParsed = this.codeAsFunction();
		var returnValue = codeParsed.run(this, uwpe);
		return returnValue;
	}
}

}