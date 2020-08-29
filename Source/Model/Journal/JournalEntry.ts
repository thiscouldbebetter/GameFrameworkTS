
class JournalEntry
{
	tickRecorded: number;
	title: string;
	body: string;

	constructor(tickRecorded: number, title: string, body: string)
	{
		this.tickRecorded = tickRecorded;
		this.title = title;
		this.body = body;
	}

	timeRecordedAsStringH_M_S(universe: Universe): string
	{
		return universe.timerHelper.ticksToStringH_M_S(this.tickRecorded)
	}

	toString(universe: Universe): string
	{
		return universe.timerHelper.ticksToStringHColonMColonS(this.tickRecorded) + " - " + this.title;
	}
}
