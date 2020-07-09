
interface Visual extends Transformable
{
	draw(universe: Universe, world: World, display: Display, entity: Entity): void;

	clone(): Visual;
	overwriteWith(x: Visual): Visual;
}
