
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

		var profileExisting = this.profiles.filter
		(
			x => x.name == profileToDelete.name
		)[0];

		if (profileExisting != null)
		{
			profiles.remove(profileExisting);
		}

		this.storageHelper.save(this.propertyName, profiles);
	};

	ProfileHelper.prototype.profileSave = function(profileToSave)
	{
		var wasSaveSuccessful;

		try
		{
			var profiles = this.profiles();
			var profileExisting = profiles.filter
			(
				x => x.name == profileToSave.name
			)[0];

			if (profileExisting != null)
			{
				profiles.remove(profileExisting);
			}
			profiles.push(profileToSave);

			this.storageHelper.save
			(
				this.propertyName,
				profiles
			);
			wasSaveSuccessful = true;
		}
		catch (err)
		{
			console.log("Error attempting save:" + err);
			wasSaveSuccessful = false;
		}

		return wasSaveSuccessful;
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
