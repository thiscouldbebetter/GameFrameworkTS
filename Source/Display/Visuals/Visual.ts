
interface Visual extends Transformable
{
	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display): void;

	clone(): Visual;
	overwriteWith(x: Visual): Visual;
}
