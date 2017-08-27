
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
	}

	ProfileHelper.prototype.profileDelete = function(profileToDelete)
	{
		var profiles = this.profiles();
		
		var profileIndex = this.profileIndexFindByName
		(
			profiles,
			profileToDelete.name
		);

		profiles.splice
		(
			profileIndex,
			1
		);

		this.storageHelper.save
		(
			this.propertyName,
			profiles
		);
	}


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
	}

	ProfileHelper.prototype.profileSave = function(profileToSave)
	{
		var profiles = this.profiles();
		
		var profileIndex = this.profileIndexFindByName
		(
			profiles,
			profileToSave.name
		);

		profiles.splice
		(
			profileIndex,
			1,
			profileToSave
		);

		this.storageHelper.save
		(
			this.propertyName,
			profiles
		);
	}

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
	}
}
