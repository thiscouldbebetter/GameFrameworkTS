
class ProfileHelper
{
	constructor(storageHelper)
	{
		this.storageHelper = storageHelper;

		this.propertyName = "Profiles";
	}

	profileAdd(profile)
	{
		var profiles = this.profiles();
		profiles.push(profile);
		this.storageHelper.save
		(
			this.propertyName,
			profiles
		);
	};

	profileDelete(profileToDelete)
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

	profileSave(profileToSave)
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

	profiles()
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

	profilesAllDelete(profileToDelete)
	{
		this.storageHelper.save
		(
			this.propertyName,
			""
		);
	};
}
