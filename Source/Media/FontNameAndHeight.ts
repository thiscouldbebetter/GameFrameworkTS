
namespace ThisCouldBeBetter.GameFramework
{

export class FontNameAndHeight implements Clonable<FontNameAndHeight>, Equatable<FontNameAndHeight>
{
	name: string;
	heightInPixels: number;

	constructor
	(
		name: string,
		heightInPixels: number
	)
	{
		this.name = name || "Font";
		this.heightInPixels = heightInPixels || 10;
	}

	static default(): FontNameAndHeight
	{
		return new FontNameAndHeight(null, null);
	}

	static fromHeightInPixels(heightInPixels: number): FontNameAndHeight
	{
		return new FontNameAndHeight(null, heightInPixels);
	}

	static fromNameAndHeightInPixels(name: string, heightInPixels: number): FontNameAndHeight
	{
		return new FontNameAndHeight(name, heightInPixels);
	}

	font(universe: Universe): Font
	{
		return universe.mediaLibrary.fontGetByName(this.name);
	}

	toStringSystemFont(): string
	{
		return this.heightInPixels + "px " + this.name;
	}


	// Clonable.

	clone(): FontNameAndHeight
	{
		return new FontNameAndHeight(this.name, this.heightInPixels);
	}

	overwriteWith(other: FontNameAndHeight): FontNameAndHeight
	{
		this.name = other.name;
		this.heightInPixels = other.heightInPixels;
		return this;
	}

	// Equatable.

	equals(other: FontNameAndHeight): boolean
	{
		var returnValue =
		(
			this.name == other.name
			&& this.heightInPixels == other.heightInPixels
		);
		return returnValue;
	}
}

}
