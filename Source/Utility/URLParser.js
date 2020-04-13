
class URLParser
{
	constructor(urlAsString)
	{
		this.urlAsString = urlAsString;

		this.queryStringParameters = [];

		var parametersAsString = this.urlAsString.search.substring(1);
		var parametersAsStrings = parametersAsString.split("&");
		for (var i = 0; i < parametersAsStrings.length; i++)
		{
			var parameterAsString = parametersAsStrings[i];
			var parameterNameAndValue = parameterAsString.split("=");
			var parameterName = parameterNameAndValue[0];
			var parameterValue = parameterNameAndValue[1];
			this.queryStringParameters.push(parameterNameAndValue);
			this.queryStringParameters[parameterName] = parameterValue;
		}
	}

	static fromWindow()
	{
		return new URLParser(window.location);
	};
}
