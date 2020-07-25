
interface ByteStream
{
	hasMoreBytes(): boolean
	peekByteCurrent(): number
	readByte(): number
	writeByte(byteToWrite: number): void
}
