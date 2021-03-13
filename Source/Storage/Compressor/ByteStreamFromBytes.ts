
namespace ThisCouldBeBetter.GameFramework
{

export class ByteStreamFromBytes implements ByteStream
{
	bytes: number[];
	byteIndexCurrent: number;

	constructor(bytes: number[])
	{
		this.bytes = bytes;
		this.byteIndexCurrent = 0;
	}

	hasMoreBytes()
	{
		return this.byteIndexCurrent < this.bytes.length;
	}

	peekByteCurrent()
	{
		return this.bytes[this.byteIndexCurrent];
	}

	readByte()
	{
		var byteRead = this.bytes[this.byteIndexCurrent];
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
		this.bytes[this.byteIndexCurrent] = byteToWrite;
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
