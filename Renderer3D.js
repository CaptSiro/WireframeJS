/**
 * @template T
 * @param {HTMLElement} parent 
 * @param {T} childClass 
 * @param {string} childIndexProp 
 * @returns {Object.<string, T>}
 */
function indexedTable (parent, childClass, childIndexProp) {
  const table = {};
  let p = 0;
  for (const child of parent.children) {
    const c = childClass.fromElement(child, String(p));
    
    if (c == undefined) {
      continue;
    }

    table[c[childIndexProp]] = c;

    const indexAsNumber = +c[childIndexProp];
    if (!isNaN(indexAsNumber)) {
      p = indexAsNumber + 1;
    }
  }

  return table;
}

/**
 * Clamps number between given bounds
 * @param {Number} min
 * @param {Number} max
 * @param {Number} number
 * @returns {Number}
 */
function clamp (min, max, number) {
  if (number < min) return min;
  return number > max ? max : number;
};



/**
 * @typedef {"visible"|"hidden"} Visibility
 */













class Vector2D {
  /** @type {number} */
  x;
  /** @type {number} */
  y;
  
  /** @type {number} */
  #size;

  /**
   * @param {number} x 
   * @param {number} y 
   */
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  get length () {
    if (this.#size == undefined) {
      this.#size = Math.sqrt(this.x * this.x + this.y * this.y);
    }

    return this.#size;
  }

  toNormal () {
    return new Vector2D(this.x / this.length, this.y / this.length);
  }

  /**
   * @param {number} newLength 
   * @returns {Vector2D} Scales it self and returns `this`
   */
  scale (newLength) {
    if (this.length == newLength) return this;

    this.x = (newLength / this.length) * this.x;
    this.y = (newLength / this.length) * this.y;

    return this;
  }

  /**
   * @param {number} n 
   * @returns {Vector2D}
   */
  multiply (n) {
    return new Vector2D(this.x * n, this.y * n);
  }

  /**
   * @param {Vertex} startingPoint 
   * @param {number} t 
   */
  getVertex (startingPoint, t) {
    return new Vertex(startingPoint.x + t * this.x, startingPoint.y + t * this.y, 0, Object.assign({}, startingPoint.options));
  }

  clone () {
    return new Vector2D(this.x, this.y);
  }

  toString () {
    return "(" + this.x + ", " + this.y + ")";
  }
}













class Vector3D {
  /** @type {number} */
  x;
  /** @type {number} */
  y;
  /** @type {number} */
  z;

  /** @type {number} */
  #size;

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   */
  constructor (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get length () {
    if (this.#size == undefined) {
      this.#size = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    return this.#size;
  }

  /**
   * @param {Vertex} startingPoint 
   * @param {number} t 
   */
  getVertex (startingPoint, t) {
    return new Vertex(startingPoint.x + t * this.x, startingPoint.y + t * this.y, startingPoint.z + t * this.z, Object.assign({}, startingPoint.options));
  }

  toNormal () {
    return new Vector3D(this.x / this.length, this.y / this.length, this.z / this.length);
  }

  /**
   * @param {number} newLength 
   */
  scale (newLength) {
    if (this.length == newLength) return;

    this.x = (newLength / this.length) * this.x;
    this.y = (newLength / this.length) * this.y;
    this.z = (newLength / this.length) * this.z;
  }
  
  reverse () {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }
  
  /**
   * @param {number} n 
   * @returns {Vector3D}
   */
  multiply (n) {
    return new Vector3D(this.x * n, this.y * n, this.z * n);
  }

  clone () {
    return new Vector3D(this.x, this.y, this.z);
  }

  toString () {
    return "(" + Math.round(this.x) + ", " + Math.round(this.y) + ", " + Math.round(this.z) + ")";
  }

  static from (a, b) {
    return new Vector3D(b.x - a.x, b.y - a.y, b.z - a.z);
  }
}













/**
 * @typedef {Object.<string, Line>} LineTable
 */
class Line {
  /**
   * @typedef LineOptions
   * @prop {Visibility} visibility
   * @prop {string} p
   * @prop {string} color
   * @prop {string} label 
   */
  /** @type {LineOptions} */
  options;

  /** @type {string} */
  start;

  /** @type {string} */
  end;

  /**
   * @param {string} start 
   * @param {string} end 
   * @param {LineOptions} options 
   */
  constructor (start, end, options = {}) {
    this.start = start;
    this.end = end;

    this.options = options;
  }
}













/**
 * @typedef DisplayVertex
 * @prop {number} x
 * @prop {number} y
 * @prop {number} size 
 * @prop {boolean} doRender
 * @prop {VertexOptions} options
 */
/**
 * @typedef Edges
 * @prop {Vertex} top
 * @prop {Vertex} bottom
 * @prop {Vertex} leftTD left edge converted to top down view
 * @prop {Vertex} rightTD right edge converted to top down view
 */
/**
 * @typedef Viewport
 * @prop {{width: number, height: number}} screen
 * @prop {number} width
 * @prop {Vector2D} horizontalVector
 * @prop {Vector2D} verticalVector
 */
/**
 * @typedef {Object.<string, Vertex>} VertexTable
 */
/**
 * @typedef {Object.<string, DisplayVertex>} DisplayVertexTable
 */
class Vertex {
  /**
   * @typedef VertexOptions
   * @prop {string} p
   * @prop {string} color
   * @prop {number} size
   * @prop {Visibility} visibility
   * @prop {string} label
   */
  /** @type {VertexOptions} */
  options = {};

  /** @type {number} */
  x;
  /** @type {number} */
  y;
  /** @type {number} */
  z;



  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @param {VertexOptions} options 
   */
  constructor (x, y, z, options = {}) {
    this.x = +x;
    this.y = +y;
    this.z = +z;
    
    this.options = options;
  }

  
  toTopDown () {
    return new Vertex(this.x, this.z, 0, Object.assign({}, this.options));
  }


  clone () {
    return new Vertex(this.x, this.y, this.z, this.options);
  }

  
  /**
   * @param {Rotation} r 
   */
  rotateBy (r) {
    const cosa = Math.cos(r.yaw);
    const sina = Math.sin(r.yaw);

    const cosb = Math.cos(r.pitch);
    const sinb = Math.sin(r.pitch);
    
    const cosc = Math.cos(r.roll);
    const sinc = Math.sin(r.roll);

    const angles = [
      [cosa * cosb, cosa * sinb * sinc - sina * cosc, cosa * sinb * cosc + sina * sinc],
      [sina * cosb, sina * sinb * sinc + cosa * cosc, sina * sinb * cosc - cosa * sinc],
      [-sinb, cosb * sinc, cosb * cosc]
    ];

    this.x = this.x * angles[0][0] + this.y * angles[0][1] + this.z * angles[0][2];
    this.y = this.x * angles[1][0] + this.y * angles[1][1] + this.z * angles[1][2];
    this.z = this.x * angles[2][0] + this.y * angles[2][1] + this.z * angles[2][2];
  }


  /**
   * @param {Vertex} vertex 
   * @returns {Vertex}
   */
  add (vertex) {
    this.x += vertex.x;
    this.y += vertex.y;
    this.z += vertex.z;
    return this;
  }


  toString () {
    return "[" + Math.round(this.x) + ", " + Math.round(this.y) + ", " + Math.round(this.z) + "]";
  }
  

  
  /**
   * 
   * @param {Vertex} v 
   * @returns {VertexOptions}
   */
  static copyOptions (v) {
    return {
      color: v.options.color ?? "white",
      p: v.options.v,
      size: v.options.size = 2,
      label: v.options.label,
      visibility: v.options.visibility ?? "visible"
    }
  }
}













class Rotation {
  static #ratio = Math.PI / 180;
  
  /** @type {number} */
  pitch;
  
  /** @type {number} */
  roll;
  
  /** @type {number} */
  yaw;
  
  /** @type {boolean} */
  #isZero;
  get isZero () { return this.#isZero; }

  /**
   * @param {number} pitch in radians
   * @param {number} roll in radians
   * @param {number} yaw in radians
   */
  constructor (pitch, roll, yaw) {
    this.pitch = pitch;
    this.roll = roll;
    this.yaw = yaw;

    this.#isZero = pitch == 0 && roll == 0 && yaw == 0;
  }

  /**
   * @param {number} pitch
   * @param {number} roll 
   * @param {number} yaw 
   */
  rotateByDeg (pitch, roll, yaw) {
    this.pitch += pitch * Rotation.#ratio;
    this.roll += roll * Rotation.#ratio;
    this.yaw += yaw * Rotation.#ratio;

    this.#isZero = pitch == 0 && roll == 0 && yaw == 0;
  }

  /**
   * @param {number} pitch
   * @param {number} roll 
   * @param {number} yaw 
   */
  rotateByRad (pitch, roll, yaw) {
    this.pitch += pitch;
    this.roll += roll;
    this.yaw += yaw;

    this.#isZero = pitch == 0 && roll == 0 && yaw == 0;
  }


  getSinCos () {
    return {
      picthSin: Math.sin(this.pitch),
      picthCos: Math.cos(this.pitch),
      rollSin: Math.sin(this.roll),
      rollCos: Math.cos(this.roll),
      yawSin: Math.sin(this.yaw),
      yawCos: Math.cos(this.yaw),
    }
  }


  /**
   * @param {number} degrees 
   */
  static toRadians (degrees) {
    return degrees * Rotation.#ratio;
  }

  /**
   * @param {number} pitch
   * @param {number} roll 
   * @param {number} yaw 
   */
  static fromDeg (pitch, roll, yaw) {
    return new Rotation(pitch * Rotation.#ratio, roll * Rotation.#ratio, yaw * Rotation.#ratio);
  }
}













/** @template {R} */
class Object3D {
  /** @type {string} */
  id;

  /** @type {VertexTable} */
  vertexTable = {};

  /** @type {Vertex} */
  pivot;
  
  /** @type {Rotation} */
  rotation = new Rotation(0, 0, 0);

  /** @type {LineTable} */
  lineTable = {};



  /**
   * @param {string} id 
   * @param {VertexTable} vtable 
   * @param {LineTable} ltable 
   */
  constructor (id, vtable, ltable) {
    this.id = id;

    let minMax = [Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity];
    for (const key in vtable) {
      minMax = [
        Math.min(minMax[0], vtable[key].x),
        Math.max(minMax[1], vtable[key].x),
        Math.min(minMax[2], vtable[key].y),
        Math.max(minMax[3], vtable[key].y),
        Math.min(minMax[4], vtable[key].z),
        Math.max(minMax[5], vtable[key].z),
      ];
    }

    this.pivot = new Vertex((minMax[0] + minMax[1]) / 2, (minMax[2] + minMax[3]) / 2, (minMax[4] + minMax[5]) / 2, { color: "red", size: 4, p: "__pivot__" });
    for (const key in vtable) {
      this.vertexTable[vtable[key].options.p] = new Vertex(vtable[key].x - this.pivot.x, vtable[key].y - this.pivot.y, vtable[key].z - this.pivot.z, vtable[key].options);
    }
    
    this.lineTable = ltable;
  }


  // transform api
  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   */
  moveBy (x, y, z) {
    this.pivot = new Vertex(x + this.pivot.x, y + this.pivot.y, z + this.pivot.z, this.pivot.options);
  }

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   */
  moveTo (x, y, z) {
    this.pivot = new Vertex(x, y, z, this.pivot.options);
  }

  center () {
    this.pivot = new Vertex(0, 0, 0, this.pivot.options);
  }

  /**
   * @param {number} t 
   */
  scale (t) {
    for (const key in this.vertexTable) {
      const direction = new Vector3D(this.vertexTable[key].x - this.pivot.x, this.vertexTable[key].y - this.pivot.y, this.vertexTable[key].z - this.pivot.z);
      const _new = direction.getVertex(this.pivot, t);
      _new.options = this.vertexTable[key].options;

      _new.options.size = (_new.options.size ?? 2) * t;
      this.vertexTable[key] = _new;
    }
  }

  /**
   * default value `2`
   * @param {number} t 
   */
  setWireFrameSize (t) {
    for (const key in this.vertexTable) {
      this.vertexTable[key].options.size = t;
    }
  }

  /**
   * @param {string} color 
   */
  setColor (color) {
    for (const key in this.vertexTable) {
      this.vertexTable[key].options.color = color;
    }

    for (const key in this.lineTable) {
      this.lineTable[key].options.color = color;
    }
  }

  #showPivot = false;
  get showPivot () { return this.#showPivot }
  /**
   * @param {boolean} bool 
   */
  displayPivot (bool) {
    this.#showPivot = bool;
  }

  /**
   * @param {Rotation} r
   */
  rotateBy (r) {
    this.rotation = new Rotation(this.rotation.pitch + r.pitch, this.rotation.roll + r.roll, this.rotation.yaw + r.yaw);
  }

  /**
   * @param {Rotation} r
   */
  rotateTo (r) {
    this.rotation = r;
  }


  /** @type {VertexTable} */
  tvertexes;
  calcTransformedVertexes () {
    /** @type {DisplayVertexTable} */
    this.tvertexes = {};
    const cosa = Math.cos(this.rotation.yaw);
    const sina = Math.sin(this.rotation.yaw);

    const cosb = Math.cos(this.rotation.pitch);
    const sinb = Math.sin(this.rotation.pitch);
    
    const cosc = Math.cos(this.rotation.roll);
    const sinc = Math.sin(this.rotation.roll);

    const angles = [
      [cosa * cosb, cosa * sinb * sinc - sina * cosc, cosa * sinb * cosc + sina * sinc], // x
      [sina * cosb, sina * sinb * sinc + cosa * cosc, sina * sinb * cosc - cosa * sinc], // y
      [-sinb, cosb * sinc, cosb * cosc]  // z
    ];

    for (const p in this.vertexTable) {
      const vertex = new Vertex(
        (this.vertexTable[p].x * angles[0][0] + this.vertexTable[p].y * angles[0][1] + this.vertexTable[p].z * angles[0][2]) + this.pivot.x,
        (this.vertexTable[p].x * angles[1][0] + this.vertexTable[p].y * angles[1][1] + this.vertexTable[p].z * angles[1][2]) + this.pivot.y,
        (this.vertexTable[p].x * angles[2][0] + this.vertexTable[p].y * angles[2][1] + this.vertexTable[p].z * angles[2][2]) + this.pivot.z,
        this.vertexTable[p].options
      );
      this.tvertexes[vertex.options.p] = vertex;
    }

    if (this.#showPivot) {
      this.tvertexes["__pivot__"] = this.pivot;
    }
  }


  /**
   * @callback FrameAnimation
   * @param {number} delatTime
   * @param {R} lastState
   * @param {Object3D} thisArg
   * @returns {R}
   */
  /** @type {FrameAnimation[]} */
  #animations = [];

  /**
   * @param {FrameAnimation} anime 
   */
  setAnimation (anime) {
    this.#animations.push(anime);
  }

  /**
   * @param {FrameAnimation} anime 
   */
  removeAnimation (anime) {
    this.#animations.splice(this.#animations.indexOf(anime), 1);
  }

  /**
   * @param {number} delatTime 
   */
  animate (delatTime) {
    for (const anime of this.#animations) {
      anime.ls = anime(delatTime, anime.ls, this);
    }
  }


  /**
   * @callback Object3DComponentArrayReducer
   * @param {VertexTable} map
   * @param {Vertex} v
   * @param {number} i
   */
  /** @type {Object3DComponentArrayReducer} */
  static reduceArray = (map, v, i) => {
    const s = String(i);
    v.options.p = s;
    map[s] = v;
    return map;
  }

  

  /**
   * @param {string} id 
   * @param {number} size 
   * @returns 
   */
  static createCube (id, size) {
    const vertexes = [
      new Vertex(0, 0, 0),
      new Vertex(0, 0, size),
      new Vertex(0, size, 0),
      new Vertex(0, size, size),
      new Vertex(size, 0, 0),
      new Vertex(size, 0, size),
      new Vertex(size, size, 0),
      new Vertex(size, size, size),
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
      new Line("3", "7")
    ];

    const vertexMap = vertexes.reduce(Object3D.reduceArray, {});
    const lineMap = lines.reduce(Object3D.reduceArray, {});

    return new Object3D(id, vertexMap, lineMap);
  }



  /**
   * @param {string} id 
   * @param {Vertex} pos 
   */
  static createPoint (id, pos) {
    const p = pos.options.p ?? "0"
    pos.options.p = p;
    
    const vertexTable = {};
    vertexTable[p] = position;
    
    return new Object3D(id, vertexTable, {});
  }
}













class KeyRegister {
  /** @type {Set<string>} */
  #active = new Set();

  /**
   * @param {HTMLElement} e 
   */
  constructor (e) {
    e.addEventListener("keydown", evt => {
      this.#active.add(evt.key.toLowerCase());
    });

    e.addEventListener("keyup", evt => {
      this.#active.delete(evt.key.toLowerCase());
    });
  }

  /**
   * @param {string} keySequence 
   * @returns {boolean}
   */
  isPressed (keySequence) {
    for (const key of keySequence.toLowerCase().split("|")) {
      if (this.#active.has(key)) {
        return true;
      }
    }
    return false;
  }
}












class Camera extends Object3D {
  static #viewportResizeObserver = new ResizeObserver((viewports) => {
    for (const v of viewports) {
      v.target.__cameras.forEach(cam => cam.recalcBounds());
    }
  });

  /** @type {{forward: Vector3D, up: Vector3D, right: Vector3D}} */
  directions = {}

  /** @type {{tl: Vertex, tr: Vertex, bl: Vertex}} */
  corners;
  
  /** @type {number} */
  focalLength;
  
  /** @type {HTMLCanvasElement} */
  viewport;

  /** @type {CanvasRenderingContext2D} */
  viewportCtx;
  
  /** @type {Vertex} */
  viewportCenter;
  
  /** @type {number} */
  calcHeight;

  /** @type {number} */
  calcWidth = 100;
  
  /** @type {HTMLCanvasElement} */
  canvasX;
  
  /** @type {CanvasRenderingContext2D} */
  ctxX;
  
  /** @type {HTMLCanvasElement} */
  canvasY;

  /** @type {CanvasRenderingContext2D} */
  ctxY;

  /** @type {KeyRegister} */
  #keyboard;

  /** @type {boolean} */
  #keyboardEnabled = true;

  /** @param {boolean} bool */
  enableMovement (bool) {
    this.#keyboardEnabled = bool;
  }
  
  /**
   * @param {string} viewport 
   * @param {HTMLCanvasElement} viewport 
   * @param {Vertex} position 
   * @param {number} focalLength 
   */
  constructor (id, viewport, position, focalLength = 70, direction = new Vector3D(1, 0, 0)) {
    super(id, {}, {});

    this.pivot = position;
    this.focalLength = focalLength;
    this.directions.forward = direction.toNormal();
    this.directions.up = new Vector3D(0, 1, 0);
    this.viewport = viewport;
    this.viewportCtx = this.viewport.getContext("2d");

    if (this.viewport.__cameras == undefined) {
      this.viewport.__cameras = [this];
    } else {
      this.viewport.__cameras.push(this);
    }

    this.recalcBounds();
    Camera.#viewportResizeObserver.observe(viewport);

    this.#keyboard = new KeyRegister(this.viewport); 
    this.setAnimation((dt) => {
      if (this.#keyboardEnabled) {
        const forwardInput = (+this.#keyboard.isPressed("w|ArrowUp") - (+this.#keyboard.isPressed("s|ArrowDown")));
        const upInput = (+this.#keyboard.isPressed(" ") - (+this.#keyboard.isPressed("Shift")));
        const rightInput = (+this.#keyboard.isPressed("d|ArrowRight") - (+this.#keyboard.isPressed("a|ArrowLeft")));
        const movementSpeed = 75 * dt / 1000;
        const cos = Math.cos(this.rotation.pitch);
        const sin = Math.sin(this.rotation.pitch);
        const heading = new Vector2D(forwardInput * cos - (rightInput) * sin, forwardInput * sin + (rightInput) * cos);
        heading.scale(movementSpeed);

        this.moveBy(isNaN(heading.x) ? 0 : heading.x, upInput * movementSpeed, isNaN(heading.y) ? 0 : heading.y);
      }
    });

    const cb = _ => {
      const mmHandler = evt => {
        this.rotateBy(Rotation.fromDeg(evt.movementX / 4, 0, -evt.movementY / 4));
      };

      const wHandler = evt => {
        this.focalLength = clamp(20, 200, Math.sign(evt.deltaY) * -5 + this.focalLength);
      };

      const pointerCapture = _ => {
        this.viewport.requestPointerLock = this.viewport.requestPointerLock || this.viewport.mozRequestPointerLock;

        try {
          this.viewport.requestPointerLock();
        } catch (error) {
          console.log(error);
        }
  
        this.viewport.addEventListener("mousemove", mmHandler);
        this.viewport.addEventListener("wheel", wHandler);
        this.viewport.removeEventListener("click", pointerCapture);

        this.viewport.setAttribute("tabindex", "0");
        this.viewport.focus();
      };

      const listenTo = ("onpointerlockchange" in document) ? "pointerlockchange" : "mozpointerlockchange";
      
      this.viewport.addEventListener("click", pointerCapture);
      document.addEventListener(listenTo, _ => {
        if (!(document.pointerLockElement === this.viewport || document.mozPointerLockElement === this.viewport)) {
          this.viewport.addEventListener("click", pointerCapture);
          this.viewport.removeEventListener("mousemove", mmHandler);
          this.viewport.removeEventListener("wheel", wHandler);
          this.viewport.removeAttribute("tabindex");
        }
      });
    }

    if (document.readyState != "complete") {
      window.addEventListener("load", cb);
    } else {
      cb();
    }
  }


  /**
   * @param {Rotation} r 
   */
  rotateBy(r) {
    this.rotation = new Rotation(
      this.rotation.pitch + r.pitch,
      0,
      clamp(-Math.PI / 2, Math.PI / 2, this.rotation.yaw + r.yaw)
    );
  }



  calcTransformedVertexes () {
    this.lineTable = {};
    this.tvertexes = {};

    const triFunctions = this.rotation.getSinCos();
    const xzRotDir = new Vector2D(triFunctions.picthCos, triFunctions.picthSin);
    const xzRotUpDir = xzRotDir.clone();

    xzRotDir.scale(triFunctions.yawCos);
    xzRotUpDir.scale(Math.cos(this.rotation.yaw + Math.PI / 2)); // yaw (mouse.y) + 90deg -> rad -> cos
    
    this.directions.forward = new Vector3D(
      xzRotDir.x,
      triFunctions.yawSin,
      xzRotDir.y
    ).toNormal();

    this.directions.up = new Vector3D(
      xzRotUpDir.x,
      Math.sin(this.rotation.yaw + Math.PI / 2), // yaw (mouse.y) + 90deg -> rad -> sin
      xzRotUpDir.y
    ).toNormal();

    this.directions.right = new Vector3D(
      this.directions.forward.y * this.directions.up.z - this.directions.forward.z * this.directions.up.y,
      this.directions.forward.x * this.directions.up.z - this.directions.forward.z * this.directions.up.x,
      this.directions.forward.x * this.directions.up.y - this.directions.forward.y * this.directions.up.x,
    ).toNormal();

    const viewportPos = this.directions.forward.getVertex(new Vertex(0, 0, 0), this.focalLength);

    const corners = {
      topLeft: this.directions.up.getVertex(this.directions.right.getVertex(viewportPos, -this.calcWidth / 2), this.calcHeight / 2).add(this.pivot),
      topRight: this.directions.up.getVertex(this.directions.right.getVertex(viewportPos, this.calcWidth / 2), this.calcHeight / 2).add(this.pivot),
      bottomRight: this.directions.up.getVertex(this.directions.right.getVertex(viewportPos, this.calcWidth / 2), -this.calcHeight / 2).add(this.pivot),
      bottomLeft: this.directions.up.getVertex(this.directions.right.getVertex(viewportPos, -this.calcWidth / 2), -this.calcHeight / 2).add(this.pivot)
    }

    this.corners = {
      tl: corners.topLeft,
      tr: corners.topRight,
      bl: corners.bottomLeft
    }
    
    if (this.showPivot == true) {
      const color = "orange";
      this.tvertexes = {
        "fp": new Vertex(this.pivot.x, this.pivot.y, this.pivot.z, {color: "crimson", p: "fp"}),

        "dir": new Vertex((this.directions.forward.x * 10) + this.pivot.x, (this.directions.forward.y * 10) + this.pivot.y, (this.directions.forward.z * 10) + this.pivot.z, {color: "#4FC3F7", p: "dir"}),
        "dir-up": new Vertex((this.directions.up.x * 10) + this.pivot.x, (this.directions.up.y * 10) + this.pivot.y, (this.directions.up.z * 10) + this.pivot.z, {color: "#7AB83D", p: "dir-up"}),
        "dir-right": new Vertex((this.directions.right.x * 10) + this.pivot.x, (this.directions.right.y * 10) + this.pivot.y, (this.directions.right.z * 10) + this.pivot.z, {color: "crimson", p: "dir-right"}),

        "corner-1": new Vertex(
          corners.topLeft.x,
          corners.topLeft.y,
          corners.topLeft.z,
          { p: "corner-1", color }
        ),
        "corner-2": new Vertex(
          corners.topRight.x,
          corners.topRight.y,
          corners.topRight.z,
          { p: "corner-2", color }
        ),
        "corner-3": new Vertex(
          corners.bottomRight.x,
          corners.bottomRight.y,
          corners.bottomRight.z,
          { p: "corner-3", color }
        ),
        "corner-4": new Vertex(
          corners.bottomLeft.x,
          corners.bottomLeft.y,
          corners.bottomLeft.z,
          { p: "corner-4", color }
        ),
      };

      this.lineTable = {
        "line-1": new Line("fp", "corner-1", { p: "line-1", color }),
        "line-2": new Line("fp", "corner-2", { p: "line-2", color }),
        "line-3": new Line("fp", "corner-3", { p: "line-3", color }),
        "line-4": new Line("fp", "corner-4", { p: "line-4", color }),
        
        "line-5": new Line("corner-1", "corner-2", { p: "line-5", color }),
        "line-6": new Line("corner-2", "corner-3", { p: "line-6", color }),
        "line-7": new Line("corner-3", "corner-4", { p: "line-7", color }),
        "line-8": new Line("corner-4", "corner-1", { p: "line-8", color }),
        
        "line-9": new Line("fp", "dir", { p: "line-9", color: "#4FC3F7" }),
        "line-10": new Line("fp", "dir-up", { p: "line-10", color: "#7AB83D" }),
        "line-11": new Line("fp", "dir-right", { p: "line-11", color: "crimson" }),
      }
    }
  }



  recalcBounds () {
    const vw = this.viewport.scrollWidth ?? this.viewport.offsetWidth;
    const vh = this.viewport.scrollHeight ?? this.viewport.offsetHeight;

    this.calcHeight = this.calcWidth * (vh / vw);

    if (this.viewport !== undefined) {
      this.viewport.width = vw;
      this.viewport.height = vh;

      this.viewportCenter = new Vertex(this.viewport.width / 2, this.viewport.height / 2, 0);
    }
  }



  /**
   * 
   * @param {Vector3D} v
   * @param {Vector3D} w
   */
  static getAngle3 (v, w) {
    return Math.acos((v.x * w.x + v.y * w.y + v.z * w.z) / (v.length * w.length));
  }

  /**
   * 
   * @param {Vector3D} planeVector 
   * @param {number} d 
   * @param {Vertex} point 
   * @param {Vector3D} vector 
   * @returns 
   */
  static getInterSection3 (planeVector, d, point, vector) {
    return (planeVector.x * point.x + planeVector.y * point.y + planeVector.z * point.z + d) / (planeVector.x * vector.x + planeVector.y * vector.y + planeVector.z * vector.z) * (-1);
  }

  /** 
   * @param {Object3D[]} objects
   */
  raycastObjects (objects) {
    this.viewportCtx.clearRect(0, 0, this.viewport.width, this.viewport.height);

    const cp = this.directions.forward.getVertex(this.pivot, this.focalLength);
    const d = (-cp.x * this.directions.forward.x) - this.directions.forward.y * cp.y - this.directions.forward.z * cp.z;
    const tltotr = Vector3D.from(this.corners.tl, this.corners.tr);
    const tltobl = Vector3D.from(this.corners.tl, this.corners.bl);

    for (const o of objects) {
      if  (o === this) continue;

      /** @type {Object.<string, DisplayVertex>} */
      const dvs = {};

      vertexLoop: for (const key in o.tvertexes) {
        const vertex = o.tvertexes[key];
        const vertexToFP = Vector3D.from(vertex, this.pivot);

        const t = Camera.getInterSection3(this.directions.forward, d, vertex, vertexToFP);

        if (t < 0 || 1 < t) continue vertexLoop;

        const intersectionPoint = vertexToFP.getVertex(vertex, t);
        const tltointer = Vector3D.from(this.corners.tl, intersectionPoint);

        const alpha = Camera.getAngle3(tltotr, tltointer);
        const beta = Camera.getAngle3(tltobl, tltointer);

        if (alpha > Math.PI / 2 || beta > Math.PI / 2) continue vertexLoop;

        const x = Math.sin(beta) * tltointer.length * this.viewport.height / tltobl.length;
        const y = Math.sin(alpha) * tltointer.length * this.viewport.width / tltotr.length;

        if (x > this.viewport.width || y > this.viewport.height) continue vertexLoop;

        dvs[vertex.options.p] = {
          x,
          y,
          size: Math.min(this.getSizeByDist(Vector3D.from(vertex, intersectionPoint).length, vertex.options.size), this.viewport.width / 16),
          options: Vertex.copyOptions(vertex)
        }

        this.drawDisplayVertex(dvs[vertex.options.p]);
      }

      for (const key in o.lineTable) {
        const line = o.lineTable[key];

        if (dvs[line.start] !== undefined && dvs[line.end] !== undefined) {
          this.drawLine(dvs[line.start], dvs[line.end], line.options);
        }
      }
    }
  }


  /**
   * @param {DisplayVertex} start
   * @param {DisplayVertex} end
   * @param {LineOptions} lineOps 
   */
  drawLine (start, end, lineOps) {
    const dir = new Vector2D(end.x - start.x, end.y - start.y);
    const n1 = new Vector2D(dir.y, -dir.x);
    const n2 = new Vector2D(-dir.y, dir.x);
    const n3 = n1.clone();
    const n4 = n2.clone();

    n1.scale(start.size);
    n2.scale(start.size);
    n3.scale(end.size);
    n4.scale(end.size);

    this.viewportCtx.fillStyle = lineOps.color;
    this.viewportCtx.beginPath();
    this.viewportCtx.moveTo(start.x + n1.x - (start.size / 2), start.y + n1.y - (start.size / 2));
    this.viewportCtx.lineTo(start.x + n2.x - (start.size / 2), start.y + n2.y - (start.size / 2));
    this.viewportCtx.lineTo(end.x + n4.x - (end.size / 2), end.y + n4.y - (end.size / 2));
    this.viewportCtx.lineTo(end.x + n3.x - (end.size / 2), end.y + n3.y - (end.size / 2));
    this.viewportCtx.fill();

    if (lineOps.label) {
      const lineCenter = dir.getVertex(start, 0.5);
      lineCenter.options.size = (start.size + ((end.size - start.size) / 2));
      const fontSize = lineCenter.options.size * 4 + 6;
      this.viewportCtx.font = fontSize + "px sans-serif";
      this.viewportCtx.textAlign = "center";

      this.viewportCtx.fillText(lineOps.label, lineCenter.x - (lineCenter.options.size / 2), (lineCenter.y) - (lineCenter.options.size / 2) - 4);
    }
    this.viewportCtx.fill();
  }


  /**
   * @param {DisplayVertex} dv 
   */
  drawDisplayVertex (dv) {
    this.viewportCtx.fillStyle = dv.options.color ?? "white";
    this.viewportCtx.beginPath();
    this.viewportCtx.arc(
      dv.x - (dv.size / 2),
      dv.y - (dv.size / 2),
      dv.size,
      0,
      2 * Math.PI
    );

    if (dv.options.label) {
      const fontSize = dv.size * 4 + 6;
      this.viewportCtx.font = fontSize + "px sans-serif";
      this.viewportCtx.textAlign = "center";
      this.viewportCtx.fillText(dv.options.label, dv.x - (dv.size / 2), (dv.y) - (dv.size / 2) - 4);
    }
    this.viewportCtx.fill();
  }


  /**
   * @param {number} distance 
   * @returns 
   */
  getSizeByDist (distance, size = 2) {
    return Math.min(size * this.focalLength / distance, this.viewport.width / 32);
  }
}













class Renderer3D extends HTMLElement {
  /** @type {Object.<string, Object3D>} */
  objectTable = {};

  /**
   * @param {Object3D} object 
   */
  addObject (object) {
    this.objectTable[object.id] = object;
  }
  
  /**
   * @param {Object3D[]} objects
   */
  addObjects (...objects) {
    objects.forEach(o => this.addObject(o));
  }

  /** @type {Object.<string, Camera>} */
  cameraTable = {};

  /**
   * @param {Camera} camera 
   */
  addCamera (camera) {
    this.cameraTable[camera.id] = camera;
  }
  
  /**
   * @param {Camera[]} cameras
   */
  addCameras (...cameras) {
    cameras.forEach(o => this.addCamera(o));
  }


  /** @type {HTMLElement} */
  screen;




  constructor () {
    super();
  }






  connectedCallback () {
    if (this.isConnected) {
      this.style.width = "100%";
      this.style.height = "100%";
      this.style.display = "block";

      this.#lastTimestamp = Date.now();

      window.addEventListener("load", evt => {
        this.textContent = "";
        this.screen = document.createElement("canvas");

        this.screen.style.width = "100%";
        this.screen.style.height = "100%";

        this.screen.width = this.parentElement.scrollWidth ?? this.parentElement.offsetWidth;
        this.screen.height = this.parentElement.scrollHeight ?? this.parentElement.offsetHeight;

        const src = this.getAttribute("src");
        if (src != null) {
          this.objFileParser(src);
        }

        this.appendChild(this.screen);

        const mainCamera = new Camera("main-camera", this.screen, new Vertex(-200, 0, 0), 50);
        this.addCameras(mainCamera);

        requestAnimationFrame(this.drawFrame.bind(this));
      });
    }
  }





  #stop = false;
  #lastTimestamp = 0;
  drawFrame () {
    const timestamp = Date.now();
    const delatTime = timestamp - this.#lastTimestamp;
    this.#lastTimestamp = timestamp;
    
    const objs = [];
    for (const objectID in this.objectTable) {
      const obj = this.objectTable[objectID];
      obj.animate(delatTime);
      obj.calcTransformedVertexes();

      objs.push(obj);
    }

    for (const id in this.cameraTable) {
      const camera = this.cameraTable[id];
      camera.animate(delatTime);
      camera.calcTransformedVertexes();

      objs.push(camera);
    }

    for (const id in this.cameraTable) {
      const cam = this.cameraTable[id];
      cam.raycastObjects(objs);
    }
    
    if (this.#stop !== true) {
      requestAnimationFrame(this.drawFrame.bind(this));
    }
  }


  stopRender () {
    this.#stop = true;
  }


  clear () {
    this.objectTable = {};
  }



  load (src) {
    this.objFileParser(src);
  }



  /**
   * @param {string} src 
   */
  async objFileParser (src) {
    const lines = (await (await fetch(src)).text()).split("\n");

    let current = "";

    let v = 1;
    let vtable = {};
    let ltable = {};


    for (let i = 0; i < lines.length; i++) {
      if (lines[i] == "") continue;

      const type = /(\w+).*/.exec(lines[i])[1];
      s : switch (type) {
        case "o": {
          if (current != "") {
            this.objRegisterObject(current, vtable, ltable);
          }

          current = lines[i].substring(2);
          vtable = {};
          ltable = {};
          break s;
        }

        case "v": {
          const matches = /v ([0-9.-]+) ([0-9.-]+).([0-9.-]+)/.exec(lines[i]);
          vtable[String(v)] = new Vertex(+matches[1], (+matches[2]), +matches[3], { p: String(v), size: 1 });
          v++;
          break s;
        }

        case "f": {
          const groups = lines[i].substring(2).split(" ");
          const vertexes = groups.map(s => /([0-9]+).{0,}/.exec(s)[1]);
          this.objCreateLines(vertexes, ltable);
          break;
        }

        case "l": {
          const vertexes = lines[i].substring(2).split(" ");
          this.objCreateLines(vertexes, ltable);
          break s;
        }
      }
    }


    if (v != 1) {
      this.objRegisterObject(current, vtable, ltable);
    }
  }

  
  
  /**
   * @param {string[]} vertexes 
   * @param {LineTable} ltable 
   */
  objCreateLines (vertexes, ltable) {
    if (vertexes.length > 2) {
      vertexes.push(vertexes[0]);
    }

    for (let i = 0; i < (vertexes.length - 1); i++) {
      const p = vertexes[i] + "->" + vertexes[i + 1];
      const pReversed = vertexes[i + 1] + "->" + vertexes[i];
      if (ltable[p] == undefined && ltable[pReversed] == undefined) {
        ltable[p] = new Line(vertexes[i], vertexes[i + 1], { p });
      }
    }
  }

  
  
  /**
   * @param {string} id 
   * @param {VertexTable} vtable 
   * @param {LineTable} ltable 
   */
  objRegisterObject (id, vtable, ltable) {
    this.objectTable[id] = new Object3D(id, vtable, ltable);
    this.objectTable[id].scale(40);
    this.objectTable[id].setWireFrameSize(1);
  }
}

customElements.define("renderer-3d", Renderer3D);