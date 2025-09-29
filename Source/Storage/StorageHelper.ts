
namespace ThisCouldBeBetter.GameFramework
{

export class StorageHelper
{
	propertyNamePrefix: string;
	serializer: Serializer;
	compressor: CompressorLZW;

	constructor
	(
		propertyNamePrefix: string,
		serializer: Serializer,
		compressor: CompressorLZW
	)
	{
		this.propertyNamePrefix = propertyNamePrefix;
		if (this.propertyNamePrefix == null)
		{
			this.propertyNamePrefix = "";
		}

		this.serializer = serializer;
		this.compressor = compressor;
	}

	static fromPrefixSerializerAndCompressor
	(
		propertyNamePrefix: string,
		serializer: Serializer,
		compressor: CompressorLZW
	): StorageHelper
	{
		return new StorageHelper
		(
			propertyNamePrefix,
			serializer,
			compressor
		);
	}

	delete(propertyName: string): void
	{
		var propertyNamePrefixed =
			this.propertyNamePrefix + propertyName;

		localStorage.removeItem(propertyNamePrefixed);
	}

	deleteAll(): void
	{
		var keysAll = Object.keys(localStorage);
		var keysWithPrefix = keysAll.filter(x => x.startsWith(this.propertyNamePrefix));
		for (var i = 0; i < keysWithPrefix.length; i++)
		{
			var key = keysWithPrefix[i];
			//var itemToDelete = localStorage.getItem(key);
			localStorage.removeItem(key);
		}
	}

	propertyWithNameReadValue(propertyName: string): string
	{
		var propertyNamePrefixed =
			this.propertyNamePrefix + propertyName;

		var returnValue =
			localStorage.getItem(propertyNamePrefixed);

		return returnValue;
	}

	propertyWithNameWriteValue(propertyName: string, valueToSet: string): StorageHelper
	{
		var propertyNamePrefixed =
			this.propertyNamePrefix + propertyName;

		localStorage.setItem(propertyNamePrefixed, valueToSet);

		return this;
	}

	load<T>(propertyName: string): T
	{
		var returnValue;

		var returnValueAsStringCompressed =
			this.propertyWithNameReadValue(propertyName);

		if (returnValueAsStringCompressed == null)
		{
			returnValue = null;
		}
		else
		{
			var returnValueDecompressed = this.compressor.decompressString
			(
				returnValueAsStringCompressed
			);
			returnValue =
				this.serializer.deserialize(returnValueDecompressed);
		}

		return returnValue;
	}

	save<T>(propertyName: string, valueToSave: T): void
	{
		var valueToSaveSerialized = this.serializer.serialize
		(
			valueToSave, false // pretty-print
		);

		var valueToSaveCompressed = this.compressor.compressString
		(
			valueToSaveSerialized
		);

		this.propertyWithNameWriteValue(propertyName, valueToSaveCompressed);
	}
}

}
