
namespace ThisCouldBeBetter.GameFramework
{

export class EquipmentSocketDefn //
{
	name: string;
	categoriesAllowedNames: string[];

	constructor(name: string, categoriesAllowedNames: string[])
	{
		this.name = name;
		this.categoriesAllowedNames = categoriesAllowedNames;
	}

	static fromNameAndCategoriesAllowedNames
	(
		name: string, categoriesAllowedNames: string[]
	): EquipmentSocketDefn
	{
		return new EquipmentSocketDefn(name, categoriesAllowedNames);
	}

}

}
