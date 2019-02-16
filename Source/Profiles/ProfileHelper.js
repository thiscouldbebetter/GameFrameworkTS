
function ProfileHelper(storageHelper)
{
	this.storageHelper = storageHelper;

	this.propertyName = "Profiles";
}
{
	ProfileHelper.prototype.profileAdd = function(profile)
	{
		var profiles = this.profiles();
		profiles.push(profile);
		this.storageHelper.save
		(
			this.propertyName,
			profiles
		);
	};

	ProfileHelper.prototype.profileDelete = function(profileToDelete)
	{
		var profiles = this.profiles();

		var profileIndex = this.profileIndexFindByName
		(
			profiles,
			profileToDelete.name
		);

		profiles.removeAt(profileIndex);

		this.storageHelper.save
		(
			this.propertyName,
			profiles
		);
	};

	ProfileHelper.prototype.profileIndexFindByName = function(profiles, profileNameToFind)
	{
		var returnValue = null;

		for (var i = 0; i < profiles.length; i++)
		{
			var profile = profiles[i];
			if (profile.name == profileNameToFind)
			{
				returnValue = i;
				break;
			}
		}

		return returnValue;
	};

	ProfileHelper.prototype.profileSave = function(profileToSave)
	{
		var profiles = this.profiles();

		var profileIndex = this.profileIndexFindByName
		(
			profiles,
			profileToSave.name
		);

		if (profileIndex == null)
		{
			profiles.push(profileToSave);
		}
		else
		{
			profiles.removeAt
			(
				profileIndex
			).insertElementAt
			(
				profileToSave,
				profileIndex
			);
		}

		try
		{
			this.storageHelper.save
			(
				this.propertyName,
				profiles
			);
		}
		catch (err)
		{
			var errorMessage = "Error attempting to save: " + err;
			alert(errorMessage);
		}
	};

	ProfileHelper.prototype.profiles = function()
	{
		var profiles = this.storageHelper.load
		(
			this.propertyName
		);

		if (profiles == null)
		{
			profiles = [];
			this.storageHelper.save
			(
				this.propertyName,
				profiles
			);
		}

		return profiles;
	};

	ProfileHelper.prototype.profilesAllDelete = function(profileToDelete)
	{
		this.storageHelper.save
		(
			this.propertyName,
			""
		);
	};
}
