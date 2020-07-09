
class URLParser
{
	urlAsString: string;
	queryStringParameters: any;

	constructor(urlAsString: string)
	{
		this.urlAsString = urlAsString;

		this.queryStringParameters = [];

		// todo - Make sure regex converts to string correctly.
		var parametersAsString = this.urlAsString.search.toString().substr(1);
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
		return new URLParser(window.location.toString());
	};
}
