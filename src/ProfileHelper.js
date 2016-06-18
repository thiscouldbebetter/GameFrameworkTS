
function ProfileHelper()
{}
{
	ProfileHelper.prototype.profileAdd = function(profile)
	{
		var profiles = this.profiles();
		profiles.push(profile);
		var propertyName = 
			Globals.Instance.programName
			+ ".Profiles";
		StorageHelper.save
		(
			propertyName,
			profiles
		);
	}

	ProfileHelper.prototype.profileDelete = function(profileToDelete)
	{
		var profilesStored = this.profiles();
		
		var profileIndex = this.profileIndexFindByName
		(
			profilesStored,
			profileToDelete.name
		);

		profilesStored.splice
		(
			profileIndex,
			1
		);

		var propertyName = 
			Globals.Instance.programName
			+ ".Profiles";

		StorageHelper.save
		(
			propertyName,
			profilesStored
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
		var profilesStored = this.profiles();
		
		var profileIndex = this.profileIndexFindByName
		(
			profilesStored,
			profileToSave.name
		);

		profilesStored.splice
		(
			profileIndex,
			1,
			profileToSave
		);

		var propertyName = 
			Globals.Instance.programName
			+ ".Profiles";

		StorageHelper.save
		(
			propertyName,
			profilesStored
		);
	}

	ProfileHelper.prototype.profiles = function()
	{
		var propertyName = 
			Globals.Instance.programName
			+ ".Profiles";

		var profiles = StorageHelper.load
		(
			propertyName
		);

		if (profiles == null)
		{
			profiles = [];
			StorageHelper.save
			(
				propertyName, 
				profiles
			);
		}

		return profiles;
	}
}
