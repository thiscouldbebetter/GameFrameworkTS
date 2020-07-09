
class EquipmentSocketDefn
{
	name: string;
	categoriesAllowedNames: string[];

	constructor(name: string, categoriesAllowedNames: string[])
	{
		this.name = name;
		this.categoriesAllowedNames = categoriesAllowedNames;
	}
}
