
namespace ThisCouldBeBetter.GameFramework
{

export class VisualSelect implements Visual
{
	childrenByName: Map<string, Visual>;
	selectChildNames: (u: Universe, w: World, p: Place, e:Entity, d: Display) => string[];

	constructor
	(
		childrenByName: Map<string, Visual>,
		selectChildNames: (u: Universe, w: World, p: Place, e:Entity, d: Display) => string[]
	)
	{
		this.childrenByName = childrenByName;
		this.selectChildNames = selectChildNames;
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var childrenToSelectNames =
			this.selectChildNames(universe, world, place, entity, display);
		var childrenSelected = childrenToSelectNames.map
		(
			childToSelectName => this.childrenByName.get(childToSelectName)
		);
		childrenSelected.forEach
		(
			childSelected => childSelected.draw(universe, world, place, entity, display)
		);
	}

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}

}
