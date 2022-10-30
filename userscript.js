/** @type {Renderer3D} */
const renderer = document.querySelector("#renderer");

const verteces = [
  new Vertex(20, 40, 20),
  new Vertex(20, 40, -20),
  new Vertex(40, -40, 40),
  new Vertex(40, -40, -40),
  new Vertex(-20, 40, 20),
  new Vertex(-20, 40, -20),
  new Vertex(-40, -40, 40),
  new Vertex(-40, -40, -40),
];
const lines = [
  new Line("0", "1"),
  new Line("0", "4"),
  new Line("0", "2"),
  new Line("1", "5"),
  new Line("1", "3"),
  new Line("3", "2"),
  new Line("4", "5"),
  new Line("2", "6"),
  new Line("4", "6"),
  new Line("5", "7"),
  new Line("6", "7"),
  new Line("3", "7"),
];

const vertexMap = verteces.reduce(Object3D.reduceArray, {});
const lineMap = lines.reduce(Object3D.reduceArray, {});
const obj = new Object3D("cube-ish", vertexMap, lineMap, false);


obj.scale(0.5);
obj.center();
obj.moveBy(0, -10, 0)

const cube = Object3D.createCube("cube-1", 25);
cube.center();
cube.setColor("yellow");
cube.displayPivot(true);

cube.setAnimation((deltaTime, ls, thisArg) => {
  ls = ls ?? 0;

  ls += deltaTime;

  thisArg.moveTo(Math.sin(ls / 1000) * 50, -10, Math.cos(ls / 1000) * 50);
  thisArg.rotateBy(Rotation.fromDeg(deltaTime / 1000 * 30, deltaTime / 1000 * 30, deltaTime / 1000 * 30));
  return ls;
});




let sceneID = 1;
const objFiles = ["custom scene", "cube.obj", "TIE.obj", "objects_parseable.obj"];
document.querySelector(".next").addEventListener("click", evt => {
  sceneID++;
  if (sceneID == objFiles.length) sceneID = 0;

  renderer.clear();
  if (sceneID == 0) {
    renderer.addObjects(obj, cube);
    return;
  }

  renderer.load(objFiles[sceneID]);
});


document.querySelector(".stopRender").addEventListener("click", evt => renderer.stopRender());