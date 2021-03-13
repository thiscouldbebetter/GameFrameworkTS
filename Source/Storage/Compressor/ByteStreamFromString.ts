
namespace ThisCouldBeBetter.GameFramework
{

export class ByteStreamFromString implements ByteStream
{
	bytesAsString: string;
	byteIndexCurrent: number;

	constructor(bytesAsString: string)
	{
		this.bytesAsString = bytesAsString;
		this.byteIndexCurrent = 0;
	}

	hasMoreBytes()
	{
		return this.byteIndexCurrent < this.bytesAsString.length;
	}

	peekByteCurrent()
	{
		return this.bytesAsString.charCodeAt(this.byteIndexCurrent);
	}

	readByte()
	{
		var byteRead = this.bytesAsString.charCodeAt(this.byteIndexCurrent);
		this.byteIndexCurrent++;
		return byteRead;
	}

	readBytes(byteCount: number)
	{
		var bytesRead = new Array<number>();
		for (var i = 0; i < byteCount; i++)
		{
			var byteRead = this.readByte();
			bytesRead.push(byteRead);
		}
		return bytesRead;
	}

	readStringOfLength(lengthOfString: number)
	{
		var returnValue = "";

		for (var i = 0; i < lengthOfString; i++)
		{
			var byte = this.readByte();

			if (byte != 0)
			{
				var byteAsChar = String.fromCharCode(byte);
				returnValue += byteAsChar;
			}
		}

		return returnValue;
	}

	writeByte(byteToWrite: number)
	{
		// todo - This'll be slow.
		this.bytesAsString += String.fromCharCode(byteToWrite);
		this.byteIndexCurrent++;
	}

	writeBytes(bytesToWrite: number[])
	{
		bytesToWrite.forEach(x => this.writeByte(x));
	}

	writeStringPaddedToLength(stringToWrite: string, lengthPadded: number)
	{
		for (var i = 0; i < stringToWrite.length; i++)
		{
			var charAsByte = stringToWrite.charCodeAt(i);
			this.writeByte(charAsByte);
		}

		var numberOfPaddingChars = lengthPadded - stringToWrite.length;
		for (var i = 0; i < numberOfPaddingChars; i++)
		{
			this.writeByte(0);
		}
	}
}

}
