
namespace ThisCouldBeBetter.GameFramework
{

export class Assert
{
	static areEqual<T extends Equatable<T>>(objectExpected: T, objectActual: T): void
	{
		var areExpectedAndActualEqual = this.areObjectsEqual
		(
			objectExpected, objectActual
		);

		if (areExpectedAndActualEqual == false)
		{
			var errorMessage = 
				"Expected: " + JSON.stringify(objectExpected)
				+ ", but was: " + JSON.stringify(objectActual) + "."

			throw new Error(errorMessage);
		}
	}

	static areNotEqual<T extends Equatable<T>>
	(
		objectExpected: T, objectActual: T
	): void
	{
		var areExpectedAndActualEqual = this.areObjectsEqual
		(
			objectExpected, objectActual
		);
		if (areExpectedAndActualEqual)
		{
			var errorMessage = 
				"The objects were equal, which was not expected.";
			throw(errorMessage);
		}
	}

	static areNumbersEqual(numberExpected: number, numberActual: number): void
	{
		if (numberActual != numberExpected)
		{
			var errorMessage = 
				"Expected: " + numberExpected
				+ ", but was: " + numberActual + "."

			throw new Error(errorMessage);
		}
	}

	static areStringsEqual(stringExpected: string, stringActual: string): void
	{
		if (stringActual != stringExpected)
		{
			var errorMessage = 
				"Expected: " + stringExpected
				+ ", but was: " + stringActual + "."

			throw new Error(errorMessage);
		}
	}

	static isEmpty(arrayToCheck: unknown[]): void
	{
		if (arrayToCheck.length != 0)
		{
			throw new Error("Expected: empty, but was: not empty.");
		}
	}

	static isFalse(valueToTest: boolean): void
	{
		if (valueToTest != false)
		{
			throw new Error("Expected: false, but was: " + valueToTest + ".");
		}
	}

	static isNotEmpty(arrayToCheck: unknown[]): void
	{
		if (arrayToCheck.length == 0)
		{
			throw new Error("Expected: not empty, but was: empty.");
		}
	}

	static isNotNull<T>(valueToTest: T): void
	{
		if (valueToTest == null)
		{
			throw new Error("Expected: not null, but was: null.");
		}
	}

	static isNull<T>(valueToTest: T): void
	{
		if (valueToTest != null)
		{
			throw new Error("Expected: null, but was: not null.");
		}
	}

	static isTrue(valueToTest: boolean): void
	{
		if (valueToTest != true)
		{
			throw new Error("Expected: true, but was: " + valueToTest + ".");
		}
	}

	static throwsError(functionToTest: Function): void
	{
		try
		{
			functionToTest();
			throw new Error("Expected an error to be thrown, but none was.")
		}
		catch (ex)
		{
			// Do nothing.
		}
	}

	// Helper methods.

	private static areObjectsEqual<T extends Equatable<T>>
	(
		objectExpected: T, objectActual: T
	): boolean
	{
		var areExpectedAndActualEqual;

		if (objectExpected == objectActual)
		{
			areExpectedAndActualEqual = true;
		}
		else if
		(
			objectExpected.equals(objectActual)
		)
		{
			areExpectedAndActualEqual = true;
		}
		else
		{
			var objectExpectedAsJson = JSON.stringify(objectExpected);
			var objectActualAsJson = JSON.stringify(objectActual);

			areExpectedAndActualEqual =
				(objectExpectedAsJson == objectActualAsJson);
		}

		return areExpectedAndActualEqual;
	}
}

}
