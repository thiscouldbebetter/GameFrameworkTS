
class BoneInfluence
{
	boneName: string;
	vertexIndicesControlled: number[];

	constructor(boneName: string, vertexIndicesControlled: number[])
	{
		this.boneName = boneName;
		this.vertexIndicesControlled = vertexIndicesControlled;
	}

	// static methods

	static buildManyForBonesAndVertexGroups(bones: Bone[], vertexGroups: VertexGroup[])
	{
		var boneInfluences = [];

		var bonesByName = ArrayHelper.addLookupsByName(bones);

		for (var i = 0; i < vertexGroups.length; i++)
		{
			var vertexGroup = vertexGroups[i];
			var boneName = vertexGroup.name;

			var bone = bonesByName.get(boneName);

			if (bone != null)
			{
				var boneInfluence = new BoneInfluence
				(
					boneName,
					vertexGroup.vertexIndices.slice()
				);

				boneInfluences.push(boneInfluence);
			}
		}

		return boneInfluences;
	};
}
