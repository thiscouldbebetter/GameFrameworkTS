
namespace ThisCouldBeBetter.GameFramework
{

export class Journal
{
	entries: JournalEntry[];

	constructor(entries: JournalEntry[])
	{
		this.entries = entries;
	}

	static fromEntries(entries: JournalEntry[]): Journal
	{
		return new Journal(entries);
	}
}

}
