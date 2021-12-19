
class CompressorLZWTests extends TestFixture
{
	_compressor: CompressorLZW;

	constructor()
	{
		super(CompressorLZWTests.name);
		this._compressor = new CompressorLZW();
	}

	tests()
	{
		var tests =
		[
			this.compressAndDecompressBytes,
			this.compressAndDecompressString
		];

		return tests;
	}

	// Tests.

	compressAndDecompressBytes(): void
	{
		var bytesToCompress = [ 1, 2, 3, 4, 5 ];
		var bytesCompressed =
			this._compressor.compressBytes(bytesToCompress);
		var bytesDecompressed =
			this._compressor.decompressBytes(bytesCompressed);

		Assert.isTrue
		(
			ArrayHelper.areEqualNonEquatable(bytesToCompress, bytesDecompressed)
		);
	}

	compressAndDecompressString(): void
	{
		var stringToCompress = "This is a test!";
		var bytesCompressed =
			this._compressor.compressString(stringToCompress);
		var stringDecompressed =
			this._compressor.decompressString(bytesCompressed);

		Assert.areStringsEqual(stringToCompress, stringDecompressed);
	}

}
