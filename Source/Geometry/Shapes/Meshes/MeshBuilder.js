"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class MeshBuilder {
            static Instance() {
                if (this._instance == null) {
                    this._instance = new MeshBuilder();
                }
                return this._instance;
            }
            biped(material, heightInPixels) {
                var heightOver2 = heightInPixels / 2;
                var heightOver3 = heightInPixels / 3;
                var heightOver4 = heightInPixels / 4;
                var heightOver6 = heightInPixels / 6;
                var heightOver8 = heightInPixels / 8;
                var heightOver12 = heightInPixels / 12;
                var heightOver18 = heightInPixels / 18;
                var heightOver24 = heightInPixels / 24;
                var heightOver36 = heightInPixels / 36;
                var meshPelvis = this.box(
                //"Pelvis",
                material, GameFramework.Coords.fromXYZ(heightOver12, heightOver24, heightOver24), GameFramework.Coords.fromXYZ(0, 0, -heightOver2));
                var meshSpine = this.box(
                //"Spine.1",
                material, GameFramework.Coords.fromXYZ(heightOver12, heightOver24, heightOver6), GameFramework.Coords.fromXYZ(0, 0, 0 - heightOver2 - heightOver4));
                var meshHead = this.box(
                //"Head",
                material, GameFramework.Coords.fromXYZ(heightOver18, heightOver18, heightOver18), GameFramework.Coords.fromXYZ(0, heightOver36, 0 - heightInPixels));
                var xInvert = GameFramework.Coords.fromXYZ(-1, 1, 1);
                var meshThighSize = GameFramework.Coords.fromXYZ(heightOver36, heightOver36, heightOver8);
                var meshThighOffsetL = GameFramework.Coords.fromXYZ(heightOver18, 0, 0 - heightOver2 + heightOver12);
                var meshThighOffsetR = meshThighOffsetL.clone().multiply(xInvert);
                var meshThighL = this.box(
                //"Thigh.L",
                material, meshThighSize, meshThighOffsetL);
                var meshThighR = this.box(
                //"Thigh.R",
                material, meshThighSize, meshThighOffsetR);
                var meshShinSize = GameFramework.Coords.fromXYZ(heightOver36, heightOver36, heightOver8);
                var meshShinOffsetL = GameFramework.Coords.fromXYZ(heightOver18, 0, 0 - heightOver6);
                var meshShinOffsetR = meshShinOffsetL.clone().multiply(xInvert);
                var meshShinL = this.box(
                //"Shin.L",
                material, meshShinSize, meshShinOffsetL);
                var meshShinR = this.box(
                //"Shin.R",
                material, meshShinSize, meshShinOffsetR);
                var meshFootSize = GameFramework.Coords.fromXYZ(heightOver36, heightOver12, heightOver36);
                var meshFootOffsetL = GameFramework.Coords.fromXYZ(heightOver18, heightOver12, 0 - heightOver36);
                var meshFootOffsetR = meshFootOffsetL.clone().multiply(xInvert);
                var meshFootL = this.box(
                //"Foot.L",
                material, meshFootSize, meshFootOffsetL);
                var meshFootR = this.box(
                //"Foot.R",
                material, meshFootSize, meshFootOffsetR);
                var meshBicepSize = GameFramework.Coords.fromXYZ(heightOver36, heightOver36, heightOver12);
                var meshBicepOffsetL = GameFramework.Coords.fromXYZ(heightOver6, 0, 0 - heightOver2 - heightOver3);
                var meshBicepOffsetR = meshBicepOffsetL.clone().multiply(xInvert);
                var meshBicepL = this.box(
                //"Bicep.L",
                material, meshBicepSize, meshBicepOffsetL);
                var meshBicepR = this.box(
                //"Bicep.R",
                material, meshBicepSize, meshBicepOffsetR);
                var meshForearmSize = GameFramework.Coords.fromXYZ(heightOver36, heightOver36, heightOver12);
                var meshForearmOffsetL = GameFramework.Coords.fromXYZ(heightOver6, 0, 0 - heightOver2 - heightOver4 + heightOver8);
                var meshForearmOffsetR = meshForearmOffsetL.clone().multiply(xInvert);
                var meshForearmL = this.box(
                //"Forearm.L",
                material, meshForearmSize, meshForearmOffsetL);
                var meshForearmR = this.box(
                //"Forearm.R",
                material, meshForearmSize, meshForearmOffsetR);
                var meshesForEntityParts = [
                    meshPelvis,
                    meshSpine,
                    meshHead,
                    meshThighL,
                    meshShinL,
                    meshFootL,
                    meshBicepL,
                    meshForearmL,
                    meshThighR,
                    meshShinR,
                    meshFootR,
                    meshBicepR,
                    meshForearmR
                ];
                var vertexGroupNames = [
                    "Pelvis",
                    "Spine.1",
                    "Head",
                    "Thigh.L",
                    "Shin.L",
                    "Foot.L",
                    "Bicep.L",
                    "Forearm.L",
                    "Thigh.R",
                    "Shin.R",
                    "Foot.R",
                    "Bicep.R",
                    "Forearm.R",
                ];
                var returnValue = this.mergeMeshes(meshesForEntityParts, vertexGroupNames);
                returnValue.transform(GameFramework.Transform_Orient.fromOrientation(GameFramework.Orientation.fromForwardAndDown(GameFramework.Coords.fromXYZ(0, 1, 0), GameFramework.Coords.fromXYZ(0, 0, 1))));
                // fix
                //this.meshVerticesMergeIfWithinDistance(returnValue, 3);
                return returnValue;
            }
            box(material, size, pos) {
                var returnMesh = this.unitCube(material);
                returnMesh
                    .transform(GameFramework.Transform_Scale.fromScaleFactors(size));
                returnMesh
                    .transform(GameFramework.Transform_Translate.fromDisplacement(pos));
                return returnMesh;
            }
            grid(sizeInCells, cellSize, material) {
                var vertexPositions = [];
                var vertexPosInCells = GameFramework.Coords.create();
                var vertexPos = GameFramework.Coords.create();
                for (var y = 0; y <= sizeInCells.y; y++) {
                    vertexPosInCells.y = y;
                    for (var x = 0; x <= sizeInCells.x; x++) {
                        vertexPosInCells.x = x;
                        vertexPos.overwriteWith(vertexPosInCells).multiply(cellSize);
                        vertexPositions.push(vertexPos.clone());
                    }
                }
                var faces = [];
                for (var y = 0; y < sizeInCells.y; y++) {
                    for (var x = 0; x < sizeInCells.x; x++) {
                        var vertexIndex = y * (sizeInCells.x + 1) + x;
                        var faceVertexIndices = [
                            vertexIndex,
                            vertexIndex + 1,
                            vertexIndex + (sizeInCells.x + 1) + 1,
                            vertexIndex + (sizeInCells.x + 1),
                        ];
                        var face = new GameFramework.Mesh_FaceBuilder(faceVertexIndices);
                        faces.push(face);
                    }
                }
                var returnMesh = new GameFramework.Mesh(GameFramework.Coords.create(), // center
                vertexPositions, faces // faceBuilders
                );
                if (material != null) {
                    var faceTextures = [];
                    var textureUVs = [
                        GameFramework.Coords.create(),
                        GameFramework.Coords.fromXY(1, 0),
                        GameFramework.Coords.fromXY(1, 1),
                        GameFramework.Coords.fromXY(0, 1),
                    ];
                    for (var y = 0; y < sizeInCells.y; y++) {
                        for (var x = 0; x < sizeInCells.x; x++) {
                            var faceTexture = new GameFramework.MeshTexturedFaceTexture(material.name, textureUVs);
                            faceTextures.push(faceTexture);
                        }
                    }
                    var returnMeshTextured = GameFramework.MeshTextured.fromGeometryMaterialsAndFaceTextures(returnMesh, [material], faceTextures);
                }
                return returnMeshTextured;
            }
            room(roomSize, neighborOffsets, connectedToNeighbors, materialWall, materialFloor, doorwayWidthScaleFactor, wallThickness) {
                doorwayWidthScaleFactor = doorwayWidthScaleFactor || 1;
                wallThickness = wallThickness || 0;
                var wallNormals = neighborOffsets;
                if (connectedToNeighbors == null) {
                    connectedToNeighbors = [false, false, false, false];
                }
                var meshesForRoom = [];
                var down = new GameFramework.Coords(0, 0, 1);
                for (var i = 0; i < wallNormals.length; i++) {
                    var wallNormal = wallNormals[i];
                    var meshForWall;
                    var wallDisplacement;
                    var connectedToNeighbor = connectedToNeighbors[i];
                    if (connectedToNeighbor) {
                        meshForWall = this.room_WallWithDoorway(materialWall, doorwayWidthScaleFactor, wallThickness);
                        wallDisplacement = wallNormal.clone().multiplyScalar(1 - wallThickness);
                    }
                    else {
                        meshForWall = this.room_Wall(materialWall);
                        wallDisplacement = wallNormal.clone();
                    }
                    var wallOrientation = new GameFramework.Orientation(wallNormal.clone(), down.clone());
                    meshForWall.transform(new GameFramework.Transform_OrientRDF(wallOrientation)).transform(new GameFramework.Transform_Translate(wallDisplacement));
                    meshesForRoom.push(meshForWall);
                }
                var meshForFloor = this.room_Floor(materialFloor);
                meshesForRoom.push(meshForFloor);
                //var meshForCeiling = this.room_Ceiling(material);
                //meshesForRoom.push(meshForCeiling);
                for (var i = 0; i < meshesForRoom.length; i++) {
                    var mesh = meshesForRoom[i];
                    var face = mesh.geometry.faces()[0];
                    var faceNormal = face.plane().normal;
                    var faceOrientationDown = (faceNormal.z == 0 ? down : GameFramework.Coords.fromXYZ(1, 0, 0));
                    var faceOrientation = GameFramework.Orientation.fromForwardAndDown(faceNormal, faceOrientationDown);
                    var faceTangent = faceOrientation.right;
                    var faceDown = faceOrientation.down;
                    mesh.transformFaceTextures(GameFramework.Transform_Scale.fromScaleFactors(GameFramework.Coords.fromXYZ(faceTangent.dotProduct(roomSize), faceDown.dotProduct(roomSize), 0).absolute().multiplyScalar(.2)));
                }
                var returnMesh = this.mergeMeshes(meshesForRoom, new Array());
                returnMesh.transform(GameFramework.Transform_Scale.fromScaleFactors(roomSize)).transform(GameFramework.Transform_Translate.fromDisplacement(GameFramework.Coords.fromXYZ(0, 0, -roomSize.z)));
                return returnMesh;
            }
            room_Ceiling(material) {
                var returnMesh = this.unitSquare(material).transform(GameFramework.Transform_Scale.fromScaleFactors(GameFramework.Coords.fromXYZ(1, 1, -1))).transform(GameFramework.Transform_Translate.fromDisplacement(GameFramework.Coords.fromXYZ(0, 0, -1))).transformFaceTextures(GameFramework.Transform_Scale.fromScaleFactors(GameFramework.Coords.ones().multiplyScalar(.2)));
                return returnMesh;
            }
            room_Floor(material) {
                var returnMesh = this.unitSquare(material).transform(GameFramework.Transform_Translate.fromDisplacement(GameFramework.Coords.fromXYZ(0, 0, 1))).transformFaceTextures(GameFramework.Transform_Scale.fromScaleFactors(GameFramework.Coords.ones().multiplyScalar(9)));
                return returnMesh;
            }
            room_Wall(material) {
                var returnMesh = GameFramework.Mesh.fromCenterVertexOffsetsAndFaceBuilders(GameFramework.Coords.create(), // center
                // vertices
                [
                    // wall
                    GameFramework.Coords.fromXY(1, -1),
                    GameFramework.Coords.fromXY(-1, -1),
                    GameFramework.Coords.fromXY(-1, 1),
                    GameFramework.Coords.fromXY(1, 1),
                ], 
                // faces
                [
                    GameFramework.Mesh_FaceBuilder.fromVertexIndices([0, 1, 2, 3]),
                ]);
                var returnMeshTextured = GameFramework.MeshTextured.fromGeometryMaterialsAndFaceTextures(returnMesh, [material], [
                    new GameFramework.MeshTexturedFaceTexture(material.name, [
                        GameFramework.Coords.fromXYZ(1, 0, 0),
                        GameFramework.Coords.create(),
                        GameFramework.Coords.fromXYZ(0, 1, 0),
                        GameFramework.Coords.fromXYZ(1, 1, 0),
                    ]),
                ]);
                return returnMeshTextured;
            }
            room_WallWithDoorway(material, doorwayWidthScaleFactor, wallThickness) {
                var doorwayHeight = 0.5;
                var doorwayWidthHalf = doorwayHeight * doorwayWidthScaleFactor / 2;
                var wt = wallThickness;
                var returnMesh = new GameFramework.Mesh(GameFramework.Coords.create(), // center
                // vertices
                [
                    // wall
                    // b = bottom, t = top, l = left, r = right.
                    // top
                    GameFramework.Coords.fromXYZ(-doorwayWidthHalf, -doorwayHeight, 0), // bl - 0
                    GameFramework.Coords.fromXYZ(doorwayWidthHalf, -doorwayHeight, 0), // br - 1
                    GameFramework.Coords.fromXYZ(doorwayWidthHalf, -1, 0), // tr - 2
                    GameFramework.Coords.fromXYZ(-doorwayWidthHalf, -1, 0), // tl - 3
                    // left
                    GameFramework.Coords.fromXYZ(-1, 1, 0), // bl - 4
                    GameFramework.Coords.fromXYZ(-doorwayWidthHalf, 1, 0), // br - 5
                    GameFramework.Coords.fromXYZ(-doorwayWidthHalf, -1, 0), // tr - 6
                    GameFramework.Coords.fromXYZ(-1, -1, 0), // tl - 7
                    // right
                    GameFramework.Coords.fromXYZ(doorwayWidthHalf, 1, 0), // bl - 8
                    GameFramework.Coords.fromXYZ(1, 1, 0), // br - 9
                    GameFramework.Coords.fromXYZ(1, -1, 0), // tr - 10
                    GameFramework.Coords.fromXYZ(doorwayWidthHalf, -1, 0), // tl - 11
                    // doorframe
                    GameFramework.Coords.fromXYZ(-doorwayWidthHalf, 1, wt), // bl - 12
                    GameFramework.Coords.fromXYZ(doorwayWidthHalf, 1, wt), // br - 13
                    GameFramework.Coords.fromXYZ(doorwayWidthHalf, -doorwayHeight, wt), // tr - 14
                    GameFramework.Coords.fromXYZ(-doorwayWidthHalf, -doorwayHeight, wt), // tl - 15
                ], 
                // vertexIndicesForFaces
                [
                    // wall
                    GameFramework.Mesh_FaceBuilder.fromVertexIndices([0, 1, 2, 3]), // top
                    GameFramework.Mesh_FaceBuilder.fromVertexIndices([4, 5, 6, 7]), // left
                    GameFramework.Mesh_FaceBuilder.fromVertexIndices([8, 9, 10, 11]), // right
                    // doorframe
                    new GameFramework.Mesh_FaceBuilder([5, 12, 15, 0]), // left
                    new GameFramework.Mesh_FaceBuilder([1, 14, 13, 8]), // right
                    // todo - top - Hard to see currently.
                ]);
                var doorwayWidth = doorwayWidthHalf * 2;
                var doorwayWidthReversed = 1 - doorwayWidth;
                var doorwayWidthReversedHalf = doorwayWidthReversed / 2;
                var doorwayHeightReversed = 1 - doorwayHeight;
                var transformScaleSides = GameFramework.Transform_Scale.fromScaleFactors(GameFramework.Coords.fromXYZ(doorwayWidthReversedHalf, .5, 0));
                var transformScaleTop = GameFramework.Transform_Scale.fromScaleFactors(GameFramework.Coords.fromXYZ(doorwayWidthHalf, doorwayHeightReversed, 0));
                var transformScaleSidesDoorframe = GameFramework.Transform_Scale.fromScaleFactors(GameFramework.Coords.fromXYZ(wallThickness, doorwayHeight, 0));
                var materialName = material.name;
                var faceTextures = [
                    // wall
                    // top
                    GameFramework.MeshTexturedFaceTexture.fromMaterialNameAndTextureUvs(materialName, [
                        GameFramework.Coords.fromXY(0, 1),
                        GameFramework.Coords.fromXY(1, 1),
                        GameFramework.Coords.fromXY(1, 0),
                        GameFramework.Coords.create(),
                    ]).transform(transformScaleTop),
                    // left
                    GameFramework.MeshTexturedFaceTexture.fromMaterialNameAndTextureUvs(materialName, [
                        GameFramework.Coords.fromXY(0, 1),
                        GameFramework.Coords.fromXY(1, 1),
                        GameFramework.Coords.fromXY(1, 0),
                        GameFramework.Coords.create(),
                    ]).transform(transformScaleSides),
                    // right
                    GameFramework.MeshTexturedFaceTexture.fromMaterialNameAndTextureUvs(materialName, [
                        GameFramework.Coords.fromXY(0, 1),
                        GameFramework.Coords.fromXY(1, 1),
                        GameFramework.Coords.fromXY(1, 0),
                        GameFramework.Coords.create(),
                    ]).transform(transformScaleSides),
                    // doorframe
                    // left
                    GameFramework.MeshTexturedFaceTexture.fromMaterialNameAndTextureUvs(materialName, [
                        GameFramework.Coords.fromXY(0, 1),
                        GameFramework.Coords.fromXY(1, 1),
                        GameFramework.Coords.fromXY(1, 0),
                        GameFramework.Coords.create(),
                    ]).transform(transformScaleSidesDoorframe),
                    // right
                    GameFramework.MeshTexturedFaceTexture.fromMaterialNameAndTextureUvs(materialName, [
                        GameFramework.Coords.fromXY(0, 1),
                        GameFramework.Coords.fromXY(1, 1),
                        GameFramework.Coords.fromXY(1, 0),
                        GameFramework.Coords.create(),
                    ]).transform(transformScaleSidesDoorframe),
                    // todo - top
                ];
                var returnMeshTextured = new GameFramework.MeshTextured(returnMesh, [material], faceTextures, null).transformFaceTextures(new GameFramework.Transform_Scale(GameFramework.Coords.ones().multiplyScalar(2)));
                return returnMeshTextured;
            }
            unitCube(material) {
                var returnMesh = this.unitCube_Geometry();
                var returnMeshTextured = GameFramework.MeshTextured.fromMeshAndMaterials(returnMesh, [material]);
                return returnMeshTextured;
            }
            unitCube_Geometry() {
                var returnMesh = new GameFramework.Mesh(GameFramework.Coords.create(), // center
                // vertices
                [
                    // top
                    GameFramework.Coords.fromXYZ(-1, -1, -1),
                    GameFramework.Coords.fromXYZ(1, -1, -1),
                    GameFramework.Coords.fromXYZ(1, 1, -1),
                    GameFramework.Coords.fromXYZ(-1, 1, -1),
                    // bottom
                    GameFramework.Coords.fromXYZ(-1, -1, 1),
                    GameFramework.Coords.fromXYZ(1, -1, 1),
                    GameFramework.Coords.fromXYZ(1, 1, 1),
                    GameFramework.Coords.fromXYZ(-1, 1, 1),
                ], 
                // vertexIndicesForFaces
                [
                    GameFramework.Mesh_FaceBuilder.fromVertexIndices([7, 3, 0, 4]), // west
                    GameFramework.Mesh_FaceBuilder.fromVertexIndices([5, 1, 2, 6]), // east
                    GameFramework.Mesh_FaceBuilder.fromVertexIndices([4, 0, 1, 5]), // north
                    GameFramework.Mesh_FaceBuilder.fromVertexIndices([6, 2, 3, 7]), // south
                    GameFramework.Mesh_FaceBuilder.fromVertexIndices([0, 3, 2, 1]), // top
                    GameFramework.Mesh_FaceBuilder.fromVertexIndices([5, 6, 7, 4]), // bottom
                ]);
                return returnMesh;
            }
            unitRing(material, numberOfVertices) {
                var vertices = [];
                var vertexIndicesForFace = [];
                for (var i = 0; i < numberOfVertices; i++) {
                    var vertexAngleInTurns = i / numberOfVertices;
                    var vertexPolar = new GameFramework.Polar(vertexAngleInTurns, 1, 0);
                    var vertex = vertexPolar.toCoords();
                    vertices.push(vertex);
                    vertexIndicesForFace.splice(0, 0, i);
                }
                var returnMesh = new GameFramework.Mesh(GameFramework.Coords.create(), // center
                vertices, [new GameFramework.Mesh_FaceBuilder(vertexIndicesForFace)]);
                var returnMeshTextured = GameFramework.MeshTextured.fromMeshAndMaterials(returnMesh, [material]);
                return returnMeshTextured;
            }
            unitSquare(material) {
                var returnMesh = new GameFramework.Mesh(GameFramework.Coords.create(), // center
                // vertices
                [
                    // back
                    GameFramework.Coords.fromXY(1, -1),
                    GameFramework.Coords.fromXY(1, 1),
                    GameFramework.Coords.fromXY(-1, 1),
                    GameFramework.Coords.fromXY(-1, -1),
                ], 
                // vertexIndicesForFaces
                [
                    GameFramework.Mesh_FaceBuilder.fromVertexIndices([3, 2, 1, 0])
                    //[0, 1, 2, 3]
                ]);
                var returnMeshTextured = new GameFramework.MeshTextured(returnMesh, [material], [
                    new GameFramework.MeshTexturedFaceTexture(material.name, [
                        GameFramework.Coords.create(),
                        GameFramework.Coords.fromXY(1, 0),
                        GameFramework.Coords.fromXY(1, 1),
                        GameFramework.Coords.fromXY(0, 1),
                    ])
                ], null);
                return returnMeshTextured;
            }
            clipFaceAgainstPlanes(faceToClip, planesToClipAgainst) {
                for (var p = 0; p < planesToClipAgainst.length; p++) {
                    faceToClip = this.splitFaceByPlaneFrontAndBack(faceToClip, planesToClipAgainst[p])[0];
                    if (faceToClip == null) {
                        break;
                    }
                }
                return faceToClip;
            }
            mergeMeshes(meshesToMerge, vertexGroupNames) {
                var verticesMerged = [];
                var faceBuildersMerged = [];
                var faceTexturesMerged = [];
                var vertexGroups = [];
                var numberOfVerticesSoFar = 0;
                for (var m = 0; m < meshesToMerge.length; m++) {
                    var meshToMerge = meshesToMerge[m];
                    var meshToMergeGeometry = meshToMerge.geometry;
                    var verticesToMerge = meshToMergeGeometry.vertices();
                    verticesMerged = verticesMerged.concat(verticesToMerge);
                    var faceBuildersToMerge = meshToMergeGeometry.faceBuilders;
                    for (var f = 0; f < faceBuildersToMerge.length; f++) {
                        var faceBuilder = faceBuildersToMerge[f];
                        faceBuilder.vertexIndicesShift(numberOfVerticesSoFar);
                        faceBuildersMerged.push(faceBuilder);
                    }
                    var faceTextures = meshToMerge.faceTextures;
                    if (faceTextures != null) {
                        for (var f = 0; f < faceTextures.length; f++) {
                            var faceTexture = faceTextures[f];
                            var faceTextureCloned = faceTexture.clone();
                            faceTexturesMerged.push(faceTextureCloned);
                        }
                    }
                    if (vertexGroupNames != null) {
                        var vertexIndicesInVertexGroup = [];
                        for (var v = 0; v < verticesToMerge.length; v++) {
                            vertexIndicesInVertexGroup.push(numberOfVerticesSoFar + v);
                        }
                        var vertexGroup = new GameFramework.VertexGroup(vertexGroupNames[m], vertexIndicesInVertexGroup);
                        vertexGroups.push(vertexGroup);
                    }
                    numberOfVerticesSoFar += verticesToMerge.length;
                }
                var returnMesh = new GameFramework.Mesh(GameFramework.Coords.create(), // center
                verticesMerged, faceBuildersMerged);
                var materialsMerged = [];
                var materialsMergedByName = new Map();
                for (var i = 0; i < meshesToMerge.length; i++) {
                    var meshToMergeMaterials = meshesToMerge[i].materials;
                    for (var m = 0; m < meshToMergeMaterials.length; m++) {
                        var material = meshToMergeMaterials[m];
                        var materialName = material.name;
                        if (materialsMergedByName.get(materialName) == null) {
                            materialsMerged.push(material);
                            materialsMergedByName.set(materialName, material);
                        }
                    }
                }
                var returnMeshTextured = new GameFramework.MeshTextured(returnMesh, materialsMerged, faceTexturesMerged, vertexGroups);
                return returnMeshTextured;
            }
            splitFaceByPlaneFrontAndBack(faceToDivide, planeToDivideOn) {
                var returnValues = new Array();
                var verticesInFacesDivided = [
                    new Array(), // front
                    new Array() // back
                ];
                var distanceOfVertexAbovePlane = 0;
                var faceToDivideVertices = faceToDivide.geometry.vertices;
                for (var v = 0; v < faceToDivideVertices.length; v++) {
                    var vertex = faceToDivideVertices[v];
                    distanceOfVertexAbovePlane =
                        planeToDivideOn.distanceToPointAlongNormal(vertex);
                    if (distanceOfVertexAbovePlane != 0) {
                        break;
                    }
                }
                var facesDividedIndex = (distanceOfVertexAbovePlane > 0 ? 0 : 1);
                var verticesInFaceDivided = verticesInFacesDivided[facesDividedIndex];
                var doAnyEdgesCollideWithPlaneSoFar = false;
                var collisionHelper = new GameFramework.CollisionHelper();
                var collision = GameFramework.Collision.create();
                var edges = faceToDivide.geometry.edges();
                for (var e = 0; e < edges.length; e++) {
                    var edge = edges[e];
                    var vertex0 = edge.vertices[0];
                    verticesInFaceDivided.push(vertex0);
                    var distanceOfVertex0AbovePlane = planeToDivideOn.distanceToPointAlongNormal(vertex0);
                    var distanceOfVertex1AbovePlane = planeToDivideOn.distanceToPointAlongNormal(edge.vertices[1]);
                    if (distanceOfVertex0AbovePlane * distanceOfVertex1AbovePlane < 0) {
                        var collision = collisionHelper.collisionOfEdgeAndPlane(edge, planeToDivideOn, collision);
                        if (collision.isActive) {
                            doAnyEdgesCollideWithPlaneSoFar = true;
                            verticesInFaceDivided.push(collision.pos);
                            facesDividedIndex = 1 - facesDividedIndex;
                            verticesInFaceDivided =
                                verticesInFacesDivided[facesDividedIndex];
                            verticesInFaceDivided.push(collision.pos);
                        }
                    }
                }
                if (doAnyEdgesCollideWithPlaneSoFar) {
                    for (var i = 0; i < verticesInFacesDivided.length; i++) {
                        var verticesInFace = verticesInFacesDivided[i];
                        if (verticesInFace.length > 2) {
                            var faceDivided = new GameFramework.FaceTextured(new GameFramework.Face(verticesInFace), faceToDivide.material);
                            returnValues.push(faceDivided);
                        }
                    }
                }
                else {
                    returnValues[facesDividedIndex] = faceToDivide;
                }
                return returnValues;
            }
        }
        GameFramework.MeshBuilder = MeshBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
