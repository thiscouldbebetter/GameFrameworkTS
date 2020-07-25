
class StorageHelper
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

	load(propertyName: string)
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
	};

	save(propertyName: string, valueToSave: any)
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
	};
}
