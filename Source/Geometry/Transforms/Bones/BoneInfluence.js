
function BoneInfluence
(
	boneName,
	vertexIndicesControlled
)
{
	this.boneName = boneName;
	this.vertexIndicesControlled = vertexIndicesControlled;
}

{
	// static methods

	BoneInfluence.buildManyForBonesAndVertexGroups = function(bones, vertexGroups)
	{
		var boneInfluences = [];

		for (var i = 0; i < vertexGroups.length; i++)
		{
			var vertexGroup = vertexGroups[i];
			var boneName = vertexGroup.name;

			var bone = bones[boneName];

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
