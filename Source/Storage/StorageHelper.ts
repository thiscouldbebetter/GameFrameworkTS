
namespace ThisCouldBeBetter.GameFramework
{

export class StorageHelper
{
	propertyNamePrefix: string;
	serializer: Serializer;
	compressor: CompressorLZW;

	constructor(propertyNamePrefix: string, serializer: Serializer, compressor: CompressorLZW)
	{
		this.propertyNamePrefix = propertyNamePrefix;
		if (this.propertyNamePrefix == null)
		{
			this.propertyNamePrefix = "";
		}

		this.serializer = serializer;
		this.compressor = compressor;
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
		for (var key in keysWithPrefix)
		{
			var itemToDelete = localStorage.getItem(key);
			localStorage.removeItem(itemToDelete);
		}
	}

	load<T>(propertyName: string): T
	{
		var returnValue;

		var propertyNamePrefixed =
			this.propertyNamePrefix + propertyName;

		var returnValueAsStringCompressed = localStorage.getItem
		(
			propertyNamePrefixed
		);

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
			returnValue = this.serializer.deserialize
			(
				returnValueDecompressed
			);
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

		var propertyNamePrefixed =
			this.propertyNamePrefix + propertyName;

		localStorage.setItem
		(
			propertyNamePrefixed,
			valueToSaveCompressed
		);
	}
}

}
