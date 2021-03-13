
namespace ThisCouldBeBetter.GameFramework
{

export class DateTime
{
	year: number;
	month: number;
	day: number;
	hours: number;
	minutes: number;
	seconds: number;

	constructor(year: number, month: number, day: number, hours: number, minutes: number, seconds: number)
	{
		this.year = year;
		this.month = month;
		this.day = day;
		this.hours = hours;
		this.minutes = minutes;
		this.seconds = seconds;
	}

	// static methods

	static fromSystemDate(systemDate: Date)
	{
		var returnValue = new DateTime
		(
			systemDate.getFullYear(),
			systemDate.getMonth() + 1,
			systemDate.getDate(),
			systemDate.getHours(),
			systemDate.getMinutes(),
			systemDate.getSeconds()
		);

		return returnValue;
	};

	static now()
	{
		return DateTime.fromSystemDate(new Date());
	};

	// instance methods

	equals(other: DateTime)
	{
		var returnValue =
		(
			this.year == other.year
			&& this.month == other.month
			&& this.day == other.day
			&& this.hours == other.hours
			&& this.minutes == other.minutes
			&& this.seconds == other.seconds
		);

		return returnValue;
	};

	toStringMMDD_HHMM_SS()
	{
		var returnValue =
			""
			+ StringHelper.padStart("" + this.month, 2, "0")
			+ StringHelper.padStart("" + this.day, 2, "0")
			+ "-"
			+ StringHelper.padStart("" + this.hours, 2, "0")
			+ StringHelper.padStart("" + this.minutes, 2, "0")
			+ "-"
			+ StringHelper.padStart("" + this.seconds, 2, "0");

		return returnValue;
	}

	toStringHH_MM_SS()
	{
		var returnValue =
			+ StringHelper.padStart("" + this.hours, 2, "0")
			+ ":"
			+ StringHelper.padStart("" + this.minutes, 2, "0")
			+ ":"
			+ StringHelper.padStart("" + this.seconds, 2, "0");

		return returnValue;
	}

	toStringTimestamp()
	{
		var returnValue =
			""
			+ this.year
			+ "/"
			+ StringHelper.padStart("" + this.month, 2, "0")
			+ "/"
			+ StringHelper.padStart("" + this.day, 2, "0")
			+ "-"
			+ StringHelper.padStart("" + this.hours, 2, "0")
			+ ":"
			+ StringHelper.padStart("" + this.minutes, 2, "0")
			+ ":"
			+ StringHelper.padStart("" + this.seconds, 2, "0");

		return returnValue;
	}

	toStringYYYY_MM_DD()
	{
		var returnValue =
			"" + this.year
			+ "/" + StringHelper.padStart("" + this.month, 2, "0")
			+ "/" + StringHelper.padStart("" + this.day, 2, "0");

		return returnValue;
	}

	toStringYYYYMMDD_HHMM_SS()
	{
		return this.year + "-" + this.toStringMMDD_HHMM_SS();
	}

	toStringYYYY_MM_DD_HH_MM_SS()
	{
		var returnValue =
			"" + this.year
			+ "/"
			+ StringHelper.padStart("" + this.month, 2, "0")
			+ "/"
			+ StringHelper.padStart("" + this.day, 2, "0")
			+ "-"
			+ StringHelper.padStart("" + this.hours, 2, "0")
			+ ":"
			+ StringHelper.padStart("" + this.minutes, 2, "0")
			+ ":"
			+ StringHelper.padStart("" + this.seconds, 2, "0");

		return returnValue;
	}
}

}
