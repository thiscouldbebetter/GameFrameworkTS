
class JournalEntry
{
	title: string;
	body: string;

	tickRecorded: number;

	constructor(title: string, body: string)
	{
		this.title = title;
		this.body = body;
	}

	toString(): string
	{
		return this.title;
	}
}
