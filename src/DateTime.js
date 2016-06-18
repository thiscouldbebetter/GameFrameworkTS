
function DateTime(year, month, day, hours, minutes, seconds)
{
	this.year = year;
	this.month = month;
	this.day = day;
	this.hours = hours;
	this.minutes = minutes;
	this.seconds = seconds;
}

{
	// static methods

	DateTime.fromSystemDate = function(systemDate)
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
	}

	DateTime.now = function()
	{
		return DateTime.fromSystemDate(new Date());
	}

	// instance methods

	DateTime.prototype.toStringTimestamp = function()
	{
		var returnValue = 
			""
			+ this.year
			+ "/"
			+ StringHelper.padStringLeft(this.month, 2, "0")
			+ "/"
			+ StringHelper.padStringLeft(this.day, 2, "0")
			+ "-"
			+ StringHelper.padStringLeft(this.hours, 2, "0")
			+ ":"
			+ StringHelper.padStringLeft(this.minutes, 2, "0")
			+ ":"
			+ StringHelper.padStringLeft(this.seconds, 2, "0")

		return returnValue;
	}
}
