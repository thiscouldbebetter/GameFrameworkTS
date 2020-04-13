
clas SkeletonHelper()
{
	static biped(heightInPixels)
	{
		var heightOver2 = heightInPixels / 2;
		var heightOfSpine = heightInPixels / 2.4;
		var heightOver3 = heightInPixels / 3;
		var heightOver4 = heightInPixels / 4;
		var heightOver6 = heightInPixels / 6;
		var heightOver8 = heightInPixels / 8;
		var heightOver9 = heightInPixels / 9;
		var heightOver12 = heightInPixels / 12;
		var heightOver18 = heightInPixels / 18;

		var legRight = new Bone
		(
			"Hip.R",
			heightOver12,
			new Orientation(new Coords(-1, 0, 0), new Coords(0, 0, 1)),
			[
				new Bone
				(
					"Thigh.R",
					heightOver4,
					new Orientation(new Coords(0, 0, 1), new Coords(-1, 0, 0)),
					[
						new Bone
						(
							"Shin.R",
							heightOver4,
							new Orientation(new Coords(0, 0, 1), new Coords(1, 0, 0)),
							[
								new Bone("Foot.R", heightOver8, new Orientation(new Coords(0, 1, 0), new Coords(1, 0, 0)), [])
							]
						),
					]
				)
			]
		);

		var legLeft = new Bone
		(
			"Hip.L",
			heightOver12,
			new Orientation(new Coords(1, 0, 0), new Coords(0, 0, 1)),
			[
				new Bone
				(
					"Thigh.L",
					heightOver4,
					new Orientation(new Coords(0, 0, 1), new Coords(-1, 0, 0)),
					[
						new Bone
						(
							"Shin.L",
							heightOver4,
							new Orientation(new Coords(0, 0, 1), new Coords(1, 0, 0)),
							[
								new Bone("Foot.L", heightOver8, new Orientation(new Coords(0, 1, 0), new Coords(1, 0, 0)), [])
							]
						),
					]
				)
			]
		);

		var upperEntity = new Bone
		(
			"Spine.1",
			heightOfSpine,
			new Orientation(new Coords(0, 0, -1), new Coords(0, -1, 0)),
			[
				new Bone
				(
					"Neck",
					heightOver12,
					new Orientation(new Coords(0, 0, -1), new Coords(0, 1, 0)),
					[
						new Bone
						(
							"Head.Back",
							heightOver18,
							new Orientation(new Coords(0, 0, -1), new Coords(0, 1, 0)),
							[
								new Bone
								(
									"Head.Front",
									heightOver9,
									new Orientation(new Coords(0, 1, 0), new Coords(0, 0, 1)),
									[]
								),
							]
						)
					]
				),
				new Bone
				(
					"Shoulder.L",
					heightOver6,
					new Orientation(new Coords(1, 0, 0), new Coords(0, 0, 1)),
					[
						new Bone
						(
							"Bicep.L",
							heightOver6,
							new Orientation(new Coords(0, -.1, 1), new Coords(-1, 0, 0)),
							[
								new Bone("Forearm.L", heightOver6, new Orientation(new Coords(0, .1, 1), new Coords(-1, 0, 0)), [])
							]
						)
					]
				),
				new Bone
				(
					"Shoulder.R",
					heightOver6,
					new Orientation(new Coords(-1, 0, 0), new Coords(0, 0, 1)),
					[
						new Bone
						(
							"Bicep.R",
							heightOver6,
							new Orientation(new Coords(0, -.1, 1), new Coords(-1, 0, 0)),
							[
								new Bone("Forearm.R", heightOver6, new Orientation(new Coords(0, .1, 1), new Coords(-1, 0, 0)), [])
							]
						)
					]
				)
			]
		); // end spine

		var skeletonBiped = new Skeleton
		(
			"Skeleton0",
			new Bone
			(
				"Root",
				heightOver2,
				new Orientation(new Coords(0, 0, -1), new Coords(0, 1, 0)),
				[
					legRight,
					legLeft,
					upperEntity,
				],

				false // isVisible - hide the root bone
			)
		);
		/*
		skeletonBiped.transform(new Transform_DimensionsSwap([0, 1]));
		skeletonBiped.transform(new Transform_Scale(new Coords(-1, -1, 1)));
		*/

		skeletonBiped.transform
		(
			new Transform_Orient
			(
				new Orientation
				(
					new Coords(0, 1, 0),
					new Coords(0, 0, 1)
				)
			)
		);

		return skeletonBiped;
	};

	static bipedAnimationDefnGroup()
	{
		var returnValue = new AnimationDefnGroup
		(
			"Biped",
			[
				SkeletonHelper.bipedAnimationDefnDoSomething(),
				SkeletonHelper.bipedAnimationDefnJump(),
				SkeletonHelper.bipedAnimationDefnWalk(),
			]
		);

		return returnValue;
	};

	static bipedAnimationDefnDoSomething()
	{
		var returnValue = new AnimationDefn
		(
			"DoSomething",
			[
				new AnimationKeyframe
				(
					0,
					[
						new Transform_BonePose("Forearm.L", 	[ .25 ]),
						new Transform_BonePose("Bicep.L", 	[ .25, 0, -.25 ]),

						new Transform_BonePose("Forearm.R", 	[ .25 ]),
						new Transform_BonePose("Bicep.R", 	[ .25, 0, .25 ]),

					]
				),
				new AnimationKeyframe
				(
					1,
					[
						new Transform_BonePose("Forearm.L", 	[ .25 ]),
						new Transform_BonePose("Bicep.L", 	[ .25, 0, .25 ]),

						new Transform_BonePose("Forearm.R", 	[ .25 ]),
						new Transform_BonePose("Bicep.R", 	[ .25, 0, -.25 ]),

					]
				),
			]
		);

		return returnValue;
	};

	static bipedAnimationDefnJump()
	{
		var returnValue = new AnimationDefn
		(
			"Jump",
			[
				new AnimationKeyframe
				(
					0,
					[
						new Transform_BonePose("Thigh.L", 	[ .25 ]),
						new Transform_BonePose("Shin.L", 	[ .25 ]),

						new Transform_BonePose("Thigh.R", 	[ .25 ]),
						new Transform_BonePose("Shin.R", 	[ .25 ]),
					]
				),
				new AnimationKeyframe
				(
					1,
					[
						new Transform_BonePose("Thigh.L", 	[ .25 ]),
						new Transform_BonePose("Shin.L", 	[ .25 ]),

						new Transform_BonePose("Thigh.R", 	[ .25 ]),
						new Transform_BonePose("Shin.R", 	[ .25 ]),
					]
				),

			]
		);

		return returnValue;
	};

	static bipedAnimationDefnWalk()
	{
		var animationDefnBipedWalk = new AnimationDefn
		(
			"Walk",
			[
				new AnimationKeyframe
				(
					0,
					[
						new Transform_BonePose("Bicep.L", 	[ -.1 ]),
						new Transform_BonePose("Forearm.L", 	[ 0 ]),
						new Transform_BonePose("Thigh.L", 	[ .1 ]),
						new Transform_BonePose("Shin.L", 	[ 0 ]),

						new Transform_BonePose("Bicep.R", 	[ .1 ]),
						new Transform_BonePose("Forearm.R", 	[ .1 ]),
						new Transform_BonePose("Thigh.R", 	[ -.05 ]),
						new Transform_BonePose("Shin.R", 	[ 0 ]),
					]
				),

				new AnimationKeyframe
				(
					5,
					[
						new Transform_BonePose("Thigh.L", 	[ .1 ]),
						new Transform_BonePose("Shin.L", 	[ .1 ]),

						new Transform_BonePose("Thigh.R", 	[ -.1 ]),
						new Transform_BonePose("Shin.R", 	[ 0 ]),
					]
				),

				new AnimationKeyframe
				(
					10,
					[
						new Transform_BonePose("Thigh.L", 	[ 0 ]),
						new Transform_BonePose("Shin.L", 	[ 0 ]),

						new Transform_BonePose("Thigh.R", 	[ 0 ]),
						new Transform_BonePose("Shin.R", 	[ .1 ]),
					]
				),

				new AnimationKeyframe
				(
					15,
					[
						new Transform_BonePose("Bicep.L", 	[ .1 ]),
						new Transform_BonePose("Forearm.L", 	[ .1 ]),
						new Transform_BonePose("Thigh.L", 	[ -.05 ]),

						new Transform_BonePose("Bicep.R", 	[ -.1 ]),
						new Transform_BonePose("Forearm.R", 	[ 0 ]),
						new Transform_BonePose("Thigh.R", 	[ .1 ]),
						new Transform_BonePose("Shin.R", 	[ 0 ]),
					]
				),

				new AnimationKeyframe
				(
					20,
					[
						new Transform_BonePose("Thigh.L", 	[ -.1 ]),
						new Transform_BonePose("Shin.L", 	[ 0 ]),

						new Transform_BonePose("Thigh.R", 	[ .1 ]),
						new Transform_BonePose("Shin.R", 	[ .1 ]),
					]
				),

				new AnimationKeyframe
				(
					25,
					[
						new Transform_BonePose("Thigh.L", 	[ 0 ]),
						new Transform_BonePose("Shin.L", 	[ .1 ]),

						new Transform_BonePose("Thigh.R", 	[ 0 ]),
						new Transform_BonePose("Shin.R", 	[ 0 ]),
					]
				),

				new AnimationKeyframe
				(
					30,
					[
						new Transform_BonePose("Bicep.L", 	[ -.1 ]),
						new Transform_BonePose("Forearm.L", 	[ 0 ]),
						new Transform_BonePose("Thigh.L", 	[ .1 ]),
						new Transform_BonePose("Shin.L", 	[ 0 ]),

						new Transform_BonePose("Bicep.R", 	[ .1 ]),
						new Transform_BonePose("Forearm.R", 	[ .1 ]),
						new Transform_BonePose("Thigh.R", 	[ -.05 ]),
						new Transform_BonePose("Shin.R", 	[ 0 ]),
					]
				),
			]
		);

		return animationDefnBipedWalk;
	};

	static transformBuildForMeshAndSkeleton_Proximity
	(
		meshAtRest,
		skeletonAtRest,
		skeletonPosed
	)
	{
		var vertices = meshAtRest.vertices;
		var bones = skeletonAtRest.bonesAll;

		var boneNameToInfluenceLookup = [];

		for (var v = 0; v < vertices.length; v++)
		{
			var vertex = vertices[v];

			var distanceLeastSoFar = Number.POSITIVE_INFINITY;
			var indexOfBoneClosestSoFar = null;

			for (var b = 0; b < bones.length; b++)
			{
				var bone = bones[b];

				var displacement = vertex.clone().subtract
				(
					bone.pos(bones).add
					(
						bone.orientation.forward.clone().multiplyScalar
						(
							bone.length
						)
					)
				);

				var distance = displacement.magnitude();

				if (distance < distanceLeastSoFar)
				{
					distanceLeastSoFar = distance;
					indexOfBoneClosestSoFar = b;
				}
			}

			var boneClosest = bones[indexOfBoneClosestSoFar];
			var boneClosestName = boneClosest.name;

			var boneInfluence = boneNameToInfluenceLookup[boneClosestName];
			if (boneInfluence == null)
			{
				boneInfluence = new BoneInfluence(boneClosestName, []);
				boneNameToInfluenceLookup[boneClosestName] = boneInfluence;
				boneNameToInfluenceLookup.push(boneInfluence);
			}

			boneInfluence.vertexIndicesControlled.push(v);
		}

		var returnValue = new TransformMeshPoseWithSkeleton
		(
			meshAtRest,
			skeletonAtRest,
			skeletonPosed,
			boneNameToInfluenceLookup
		);

		return returnValue;
	};
}
