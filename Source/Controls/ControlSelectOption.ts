
namespace ThisCouldBeBetter.GameFramework
{

export class ControlSelectOption<T>
{
	value: T;
	text: string;

	fontHeightInPixels: number;

	constructor(value: T, text: string)
	{
		this.value = value;
		this.text = text;
	}
}

}
