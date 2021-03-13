
namespace ThisCouldBeBetter.GameFramework
{

export interface ByteStream
{
	hasMoreBytes(): boolean
	peekByteCurrent(): number
	readByte(): number
	readBytes(byteCount: number): number[]
	readStringOfLength(lengthOfString: number): string;
	writeByte(byteToWrite: number): void;
	writeBytes(bytesToWrite: number[]): void;
	writeStringPaddedToLength(stringToWrite: string, lengthPadded: number): void;
}

}
