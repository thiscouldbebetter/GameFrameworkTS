
namespace ThisCouldBeBetter.GameFramework
{

export class DiceRoll
{
	numberOfDice: number;
	sidesPerDie: number;
	offset: number

	constructor(numberOfDice: number, sidesPerDie: number, offset: number)
	{
		this.numberOfDice = numberOfDice;
		this.sidesPerDie = sidesPerDie;
		this.offset = offset;
	}

	static fromExpression(expression: string): DiceRoll
	{
		var numberOfDiceAndRemainderAsStrings = expression.split("d");
		var numberOfDiceAsString = numberOfDiceAndRemainderAsStrings[0];
		var numberOfDice = parseInt(numberOfDiceAsString);

		var expressionRemainder = numberOfDiceAndRemainderAsStrings[1];

		var sidesPerDie = 0;
		var offset = 0;

		var expressionHasPlus = (expressionRemainder.indexOf("+") >= 0);
		var expressionHasMinus = (expressionRemainder.indexOf("-") >= 0);

		if (expressionHasPlus)
		{
			var sidesPerDieAndOffsetMagnitudeAsStrings =
				expressionRemainder.split("+");

			var sidesPerDieAsString =
				sidesPerDieAndOffsetMagnitudeAsStrings[0];
			var offsetMagnitudeAsString =
				sidesPerDieAndOffsetMagnitudeAsStrings[1];

			sidesPerDie = parseInt(sidesPerDieAsString);
			var offsetMagnitude = parseInt(offsetMagnitudeAsString);
			offset = offsetMagnitude;
		}
		else if (expressionHasMinus)
		{
			var sidesPerDieAndOffsetMagnitudeAsStrings =
				expressionRemainder.split("-");

			var sidesPerDieAsString =
				sidesPerDieAndOffsetMagnitudeAsStrings[0];
			var offsetMagnitudeAsString =
				sidesPerDieAndOffsetMagnitudeAsStrings[1];

			sidesPerDie = parseInt(sidesPerDieAsString);
			var offsetMagnitude = parseInt(offsetMagnitudeAsString);
			offset = 0 - offsetMagnitude;
		}
		else
		{
			var sidesPerDieAsString = expressionRemainder;
			sidesPerDie = parseInt(sidesPerDieAsString);
		}

		return new DiceRoll(numberOfDice, sidesPerDie, offset);
	}

	static fromOffset(offset: number): DiceRoll
	{
		return new DiceRoll(0, 0, offset);
	}

	// static methods

	static roll(expression: string, randomizer: Randomizer): number
	{
		var diceRoll = DiceRoll.fromExpression(expression);
		var returnValue = diceRoll.roll(randomizer);
		return returnValue;
	}

	roll(randomizer: Randomizer): number
	{
		var totalSoFar = 0;

		for (var d = 0; d < this.numberOfDice; d++)
		{
			var randomNumber =
			(
				randomizer == null
				? Math.random()
				: randomizer.getNextRandom()
			);

			var valueRolledOnDie =
				1
				+ Math.floor
				(
					randomNumber
					* this.sidesPerDie
				);

			totalSoFar += valueRolledOnDie;
		}

		totalSoFar += this.offset;

		return totalSoFar;
	}
}

}
