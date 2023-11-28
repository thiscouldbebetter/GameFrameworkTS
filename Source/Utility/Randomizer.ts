
namespace ThisCouldBeBetter.GameFramework
{

export class Randomizer
{
	// Abstract methods.

	fraction(): number { throw new Error("Method must be overridden."); }
	integerLessThan(max: number): number { throw new Error("Method must be overridden."); }

	// Other methods.

	chooseNElementsFromArray<T>
	(
		numberToChoose: number,
		arrayToChooseFrom: T[]
	): T[]
	{
		var elementsChosen = new Array<T>();

		var elementsRemaining = arrayToChooseFrom.map(x => x);

		for (var i = 0; i < numberToChoose; i++)
		{
			var elementIndexRandom =
				this.integerLessThan(elementsRemaining.length);
			var elementChosen = elementsRemaining[elementIndexRandom];

			elementsChosen.push(elementChosen);

			elementsRemaining.splice(elementsRemaining.indexOf(elementChosen), 1);
		}

		return elementsChosen;
	}
}

}
