
namespace ThisCouldBeBetter.GameFramework
{

export class CharacterSet
{
	name: string;
	charactersAsString: string;

	constructor(name: string, charactersAsString: string)
	{
		this.name = name;
		this.charactersAsString = charactersAsString;
	}

	static _instances: CharacterSet_Instances;
	static Instances(): CharacterSet_Instances
	{
		if (this._instances == null)
		{
			this._instances = new CharacterSet_Instances();
		}
		return this._instances;
	}

	static byName(name: string): CharacterSet
	{
		return this.Instances().byName(name);
	}

	characterAtIndex(charIndex: number): string
	{
		return this.charactersAsString[charIndex];
	}

	characterCount(): number
	{
		return this.charactersAsString.length;
	}

	characterFirst(): string
	{
		return this.charactersAsString[0];
	}

	characterLast(): string
	{
		return this.charactersAsString[this.charactersAsString.length - 1];
	}

	containsCharacter(characterToCheck: string): boolean
	{
		return this.charactersAsString.indexOf(characterToCheck) >= 0;
	}

	indexOfCharacter(characterToFindIndexOf: string): number
	{
		return this.charactersAsString.indexOf(characterToFindIndexOf);
	}
}

export class CharacterSet_Instances
{
	LettersSpaceNumeralsPunctuation: CharacterSet;
	LettersUppercase: CharacterSet;

	_All: CharacterSet[];

	constructor()
	{
		var cs = (name: string, chars: string) => new CharacterSet(name, chars);

		var lettersUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var lettersLowercase = "abcdefghijklmnopqrstuvwxyz";
		var letters = lettersUppercase + lettersLowercase;
		var space = " ";
		var numerals = "0123456789";
		var punctuation = ".,;:-/'\"()[]{}|\_+=?!@#$%^&*";

		this.LettersSpaceNumeralsPunctuation = cs
		(
			"LettersSpaceNumeralsPunctuation",
			letters + space + numerals + punctuation
		);

		this.LettersUppercase = cs("LettersUppercase", lettersUppercase);

		this._All =
		[
			this.LettersSpaceNumeralsPunctuation,
			this.LettersUppercase
		];
	}

	byName(name: string): CharacterSet
	{
		return this._All.find(x => x.name == name);
	}
}

}