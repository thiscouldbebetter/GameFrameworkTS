
class Transform_MeshPoseWithSkeleton implements Transform
{
	meshAtRest: MeshTextured;
	skeletonAtRest: Skeleton;
	boneInfluences: BoneInfluence[];
	boneInfluencesByName: any;
	skeletonPosed: Skeleton;

	_orientation: Orientation;
	_vertex: Coords;

	constructor
	(
		meshAtRest: MeshTextured,
		skeletonAtRest: Skeleton,
		boneInfluences: BoneInfluence[],
		skeletonPosed: Skeleton
	)
	{
		this.meshAtRest = meshAtRest;
		this.skeletonAtRest = skeletonAtRest;
		this.skeletonPosed = skeletonPosed || this.skeletonAtRest.clone();
		this.boneInfluences = boneInfluences;
		this.boneInfluencesByName = ArrayHelper.addLookups( this.boneInfluences, (x: BoneInfluence) => x.boneName );

		// Helper variables.
		this._orientation = new Orientation(new Coords(0, 0, 0), new Coords(0, 0, 0));
		this._vertex = new Coords(0, 0, 0);
	}

	overwriteWith(other: Transform): Transform
	{
		return this; // todo
	}

	transform(transformable: Transformable): Transformable
	{
		this.transformMesh(transformable as MeshTextured);
		return transformable;
	};

	transformCoords(coordsToTransform: Coords): Coords
	{
		return coordsToTransform;
	}

	transformMesh(meshToPose: MeshTextured)
	{
		var meshAtRestVertices = this.meshAtRest.geometry.vertexOffsets;
		var meshToPoseVertices = meshToPose.geometry.vertexOffsets;

		var bonesAtRest = this.skeletonAtRest.bonesAllByName;
		var bonesPosed = this.skeletonPosed.bonesAllByName;

		for (var i = 0; i < this.boneInfluences.length; i++)
		{
			var boneInfluence = this.boneInfluences[i];
			var boneName = boneInfluence.boneName;

			var boneAtRest = bonesAtRest[boneName];
			var bonePosed = bonesPosed[boneName];

			var boneAtRestOrientation = boneAtRest.orientation;

			var vertexIndicesControlled = boneInfluence.vertexIndicesControlled;
			for (var vi = 0; vi < vertexIndicesControlled.length; vi++)
			{
				var vertexIndex = vertexIndicesControlled[vi];

				var vertexAtRest = meshAtRestVertices[vertexIndex];
				var vertexToPose = meshToPoseVertices[vertexIndex];

				var boneAtRestPos = boneAtRest.pos(bonesAtRest);
				var bonePosedPos = bonePosed.pos(bonesPosed);

				var vertexAtRestProjected = this._vertex.overwriteWith
				(
					vertexAtRest
				).subtract
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

				var bonePosedOrientation = this._orientation.overwriteWith
				(
					bonePosed.orientation
				);

				vertexToPose.add
				(
					bonePosedOrientation.right.multiplyScalar
					(
						vertexAtRestProjected.x
					)
				).add
				(
					bonePosedOrientation.down.multiplyScalar
					(
						vertexAtRestProjected.y
					)
				).add
				(
					bonePosedOrientation.forward.multiplyScalar
					(
						vertexAtRestProjected.z
					)
				);
			}

		} // end for each boneInfluence
	};

}
