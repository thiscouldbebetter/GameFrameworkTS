
class EquipmentSocketDefn
{
	name: string;
	categoriesAllowedNames: string[];

	constructor(name, categoriesAllowedNames)
	{
		this.name = name;
		this.categoriesAllowedNames = categoriesAllowedNames;
	}
}
