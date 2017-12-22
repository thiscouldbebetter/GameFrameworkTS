
function Transform_MeshPoseWithSkeleton
(
	meshAtRest,
	skeletonAtRest,
	skeletonPosed,
	boneInfluences
)
{
	this.meshAtRest = meshAtRest;
	this.skeletonAtRest = skeletonAtRest;
	this.skeletonPosed = skeletonPosed;
	this.boneInfluences = boneInfluences;
	this.boneInfluences.addLookups("boneName");
}

{
	Transform_MeshPoseWithSkeleton.prototype.transformMesh = function(meshToPose)
	{
		var meshAtRestVertices = this.meshAtRest.geometry.vertices();
		var meshToPoseVertices = meshToPose.geometry.vertices();

		var bonesAtRest = this.skeletonAtRest.bonesAll;
		var bonesPosed = this.skeletonPosed.bonesAll;

		for (var i = 0; i < this.boneInfluences.length; i++)
		{
			var boneInfluence = this.boneInfluences[i];
			var boneName = boneInfluence.boneName;

			var boneAtRest = bonesAtRest[boneName];
			var bonePosed = bonesPosed[boneName];

			var boneAtRestOrientation = boneAtRest.orientation;
			var bonePosedOrientation = bonePosed.orientation;

			var vertexIndicesControlled = boneInfluence.vertexIndicesControlled;
			for (var vi = 0; vi < vertexIndicesControlled.length; vi++)
			{
				var vertexIndex = vertexIndicesControlled[vi];

				var vertexAtRest = meshAtRestVertices[vertexIndex];
				var vertexToPose = meshToPoseVertices[vertexIndex];

				var boneAtRestPos = boneAtRest.pos(bonesAtRest);
				var bonePosedPos = bonePosed.pos(bonesPosed);

				var vertexAtRestProjected = vertexAtRest.clone().subtract
				(
					boneAtRestPos
				);

				vertexAtRestProjected.overwriteWithDimensions
				(
					vertexAtRestProjected.dotProduct(boneAtRestOrientation.right),
					vertexAtRestProjected.dotProduct(boneAtRestOrientation.down),
					vertexAtRestProjected.dotProduct(boneAtRestOrientation.forward)
				);

				vertexToPose.overwriteWith
				(
					bonePosedPos
				);

				vertexToPose.add
				(
					bonePosedOrientation.right.clone().multiplyScalar
					(
						vertexAtRestProjected.x
					)
				).add
				(
					bonePosedOrientation.down.clone().multiplyScalar
					(
						vertexAtRestProjected.y
					)
				).add
				(
					bonePosedOrientation.forward.clone().multiplyScalar
					(
						vertexAtRestProjected.z
					)
				);
			}

		} // end for each boneInfluence
	}
}
