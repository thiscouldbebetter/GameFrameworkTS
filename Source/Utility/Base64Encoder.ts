
namespace ThisCouldBeBetter.GameFramework
{

export class Base64Encoder
{
	// constants

	static Base64DigitsAsString = 
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ" 
		+ "abcdefghijklmnopqrstuvwxyz"
		+ "0123456789"
		+ "+/";

	// static methods

	static base64StringToBytes(base64StringToConvert: string)
	{
		// Convert each four sets of six bits (sextets, or Base 64 digits)
		// into three sets of eight bits (octets, or bytes)

		var returnBytes = [];

		//var bytesPerSet = 3;
		var base64DigitsPerSet = 4;
		var base64DigitsAll = Base64Encoder.Base64DigitsAsString;

		var indexOfEqualsSign = base64StringToConvert.indexOf("=");

		if (indexOfEqualsSign >= 0)
		{
			base64StringToConvert = base64StringToConvert.substring
			(
				0, 
				indexOfEqualsSign
			);
		}

		var numberOfBase64DigitsToConvert = base64StringToConvert.length;

		var numberOfFullSets = Math.floor
		(
			numberOfBase64DigitsToConvert 
			/ base64DigitsPerSet
		);

		var numberOfBase64DigitsInFullSets = 
			numberOfFullSets * base64DigitsPerSet;

		var numberOfBase64DigitsLeftAtEnd = 
			numberOfBase64DigitsToConvert - numberOfBase64DigitsInFullSets;

		for (var s = 0; s < numberOfFullSets; s++)
		{
			var d = s * base64DigitsPerSet;

			var valueToEncode = 
				(base64DigitsAll.indexOf(base64StringToConvert[d]) << 18)
				| (base64DigitsAll.indexOf(base64StringToConvert[d + 1]) << 12)
				| (base64DigitsAll.indexOf(base64StringToConvert[d + 2]) << 6)
				| (base64DigitsAll.indexOf(base64StringToConvert[d + 3]));

			returnBytes.push((valueToEncode >> 16) & 0xFF);
			returnBytes.push((valueToEncode >> 8) & 0xFF);
			returnBytes.push((valueToEncode) & 0xFF);
		}	

		var d = numberOfFullSets * base64DigitsPerSet;

		if (numberOfBase64DigitsLeftAtEnd > 0)
		{
			var valueToEncode = 0;

			for (var i = 0; i < numberOfBase64DigitsLeftAtEnd; i++)
			{
				var digit = base64StringToConvert[d + i];
				var digitValue = base64DigitsAll.indexOf(digit);
				var bitsToShift = (18 - 6 * i);
				var digitValueShifted = digitValue << bitsToShift;

				valueToEncode = 
					valueToEncode
					| digitValueShifted;
			}


			for (var b = 0; b < numberOfBase64DigitsLeftAtEnd; b++)
			{
				var byteValue = (valueToEncode >> (16 - 8 * b)) & 0xFF;
				if (byteValue > 0)
				{
					returnBytes.push(byteValue);
				}
			}
		}

		return returnBytes;
	}

	static bytesToBase64String(bytesToEncode: number[])
	{
		// Encode each three sets of eight bits (octets, or bytes)
		// as four sets of six bits (sextets, or Base 64 digits)

		var returnString = "";

		var bytesPerSet = 3;
		//var base64DigitsPerSet = 4;
		var base64DigitsAsString = Base64Encoder.Base64DigitsAsString;

		var numberOfBytesToEncode = bytesToEncode.length;
		var numberOfFullSets = Math.floor(numberOfBytesToEncode / bytesPerSet);
		var numberOfBytesInFullSets = numberOfFullSets * bytesPerSet;
		var numberOfBytesLeftAtEnd = numberOfBytesToEncode - numberOfBytesInFullSets;

		for (var s = 0; s < numberOfFullSets; s++)
		{
			var b = s * bytesPerSet;

			var valueToEncode = 
				(bytesToEncode[b] << 16)
				| (bytesToEncode[b + 1] << 8)
				| (bytesToEncode[b + 2]);

			returnString += base64DigitsAsString[((valueToEncode & 0xFC0000) >>> 18)];
			returnString += base64DigitsAsString[((valueToEncode & 0x03F000) >>> 12)];
			returnString += base64DigitsAsString[((valueToEncode & 0x000FC0) >>> 6)];
			returnString += base64DigitsAsString[((valueToEncode & 0x00003F))];
		}

		var b = numberOfFullSets * bytesPerSet;

		if (numberOfBytesLeftAtEnd == 1)
		{
			var valueToEncode = (bytesToEncode[b] << 16);

			returnString += base64DigitsAsString[((valueToEncode & 0xFC0000) >>> 18)];
			returnString += base64DigitsAsString[((valueToEncode & 0x03F000) >>> 12)];
			returnString += "==";
		}
		else if (numberOfBytesLeftAtEnd == 2)
		{
			var valueToEncode = 
				(bytesToEncode[b] << 16)
				| (bytesToEncode[b + 1] << 8);

			returnString += base64DigitsAsString[((valueToEncode & 0xFC0000) >>> 18)];
			returnString += base64DigitsAsString[((valueToEncode & 0x03F000) >>> 12)];
			returnString += base64DigitsAsString[((valueToEncode & 0x000FC0) >>> 6)];
			returnString += "=";
		}

		return returnString;
	}
}

}
