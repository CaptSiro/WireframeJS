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
   */
  scale (newLength) {
    this.x = (newLength / this.length) * this.x;
    this.y = (newLength / this.length) * this.y;
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
    return new Vertex(startingPoint.x + t * this.x, startingPoint.y + t * this.y, 0, startingPoint.options);
  }

  clone () {
    return new Vector2D(this.x, this.y);
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
    return new Vertex(startingPoint.x + t * this.x, startingPoint.y + t * this.y, startingPoint.z + t * this.z, startingPoint.options);
  }
}




















class Line {
  /**
   * @typedef LineOptions
   * @prop {Visibility} visibility
   * @prop {string} p
   * @prop {string} color
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



  /**
   * @param {HTMLElement} lnElement
   * @param {string=} p
   * @returns {Line=}
   */
  static fromElement (lnElement, p) {
    const matches = /(.+)->(.+)/.exec(lnElement.innerText);

    if (matches.length != 3 || matches == null) {
      return;
    }

    const ln = new Line(matches[1], matches[2]);
    const vis = lnElement.getAttribute("visibility");
    ln.remove = Boolean(lnElement.getAttribute("remove"));

    const pointer = lnElement.getAttribute("p") ?? p;

    if (pointer != null) {
      ln.p = pointer;
    }

    if (vis != null) {
      ln.visibility = vis;
    }

    return ln;
  }
}






/**
 * @typedef DisplayVertex
 * @prop {number} x
 * @prop {number} y
 * @prop {number} dist
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














class Vertex {
  /**
   * @typedef VertexOptions
   * @prop {string} p
   * @prop {string} color
   * @prop {number} size
   * @prop {Visibility} visibility
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
    return new Vertex(this.x, this.z, 0, this.options);
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


  toString () {
    return this.p + " [" + this.x + ", " + this.y + ", " + this.z + "]";
  }


  /**
   * @param {HTMLElement} vElement
   * @param {string=} p
   * @returns {Vertex=}
   */
  static fromElement (vElement, p) {
    const matches = /(-?[0-9]+) ?; ?(-?[0-9]+) ?; ?(-?[0-9]+)/.exec(vElement.innerText);

    if (matches.length != 4 || matches == null) {
      return;
    }

    const v = new Vertex(matches[1], matches[2], matches[3]);
    const pointer = vElement.getAttribute("p") ?? p;

    if (pointer != null) {
      v.p = pointer;
    }

    return v;
  }


  /**
   * @param {Vertex} fpTopDown 
   * @param {Vertex} convertedFP 
   * @param {Vector2D} fpToCP_topDown 
   * @param {Edges} edges 
   * @param {Viewport} viewport 
   * @returns {DisplayVertex}
   */
  toDisplayVertex (fpTopDown, convertedFP, fpToCP_topDown, edges, viewport) {
    const vertexTD = this.toTopDown();
    
    const ratioX = Renderer3D.getIntersectionRatio2D(edges.leftTD, viewport.horizontalVector, vertexTD, new Vector2D(fpTopDown.x - vertexTD.x, fpTopDown.y - vertexTD.y));
    const interPointX = viewport.horizontalVector.getVertex(edges.leftTD, ratioX.t);

    // y                                                                                      normal vector to plane fp to cp
    const { t } = Renderer3D.getIntersectionRatio2D(fpTopDown, fpToCP_topDown, this.toTopDown(), new Vector2D(fpToCP_topDown.y, -fpToCP_topDown.x));
    const interPointPlane = fpToCP_topDown.getVertex(fpTopDown, t);

    const q = new Vector2D(fpTopDown.x - interPointPlane.x, fpTopDown.y - interPointPlane.y).length;
    const convertedVertex = new Vertex(convertedFP.x - q, -this.y);

    const ratioY = Renderer3D.getIntersectionRatio2D(
      edges.top, 
      viewport.verticalVector, 
      convertedVertex, 
      new Vector2D(convertedFP.x - convertedVertex.x, convertedFP.y - convertedVertex.y) // from converted vertex to converted focal point
    );

    const interPointY = viewport.verticalVector.getVertex(edges.top, ratioY.t);
    const dist = Math.round(new Vector3D(vertexTD.x - interPointX.x, this.y - interPointY.y, vertexTD.y - interPointX.y).length);
    // const dist = new Vector2D(vertexTD.x - interPointX.x, vertexTD.y - interPointX.y).length;
    
    return {
      x: Math.round(viewport.screen.width - viewport.screen.width * ratioX.t),
      y: Math.round(viewport.screen.height - viewport.screen.height * ratioY.t),
      doRender: ratioX.intersects && ratioY.intersects,
      dist,
      options: this.options
    };
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

  /** @type {boolean} */
  isRef;

  /** @type {Object.<string, Vertex>} */
  vertextTable = {};

  /** @type {Vertex} */
  pivot;
  
  /** @type {Rotation} */
  rotation = new Rotation(0, 0, 0);

  /** @type {Object.<string, Line>} */
  lineTable = {};



  /**
   * @param {string} id 
   * @param {Object.<string, Vertex>} vtable 
   * @param {Object.<string, Line>} ltable 
   * @param {boolean} isRef 
   */
  constructor (id, vtable, ltable, isRef = false) {
    this.id = id;
    this.isRef = isRef;

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

    this.pivot = new Vertex((minMax[0] + minMax[1]) / 2, (minMax[2] + minMax[3]) / 2, (minMax[4] + minMax[5]) / 2, { color: "red", size: 4 });
    for (const key in vtable) {
      this.vertextTable[vtable[key].options.p] = new Vertex(vtable[key].x - this.pivot.x, vtable[key].y - this.pivot.y, vtable[key].z - this.pivot.z, vtable[key].options);
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
    for (const key in this.vertextTable) {
      const direction = new Vector3D(this.vertextTable[key].x - this.pivot.x, this.vertextTable[key].y - this.pivot.y, this.vertextTable[key].z - this.pivot.z);
      const _new = direction.getVertex(this.pivot, t);
      _new.options = this.vertextTable[key].options;

      _new.options.size = (_new.options.size ?? 2) * t;
      this.vertextTable[key] = _new;
    }
  }

  /**
   * default value `2`
   * @param {number} t 
   */
  setWireFrameSize (t) {
    for (const key in this.vertextTable) {
      this.vertextTable[key].options.size = t;
    }
  }

  /**
   * @param {string} color 
   */
  setColor (color) {
    for (const key in this.vertextTable) {
      this.vertextTable[key].options.color = color;
    }

    for (const key in this.lineTable) {
      this.lineTable[key].options.color = color;
    }
  }

  #showPivot = false;
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





  /**
   * @param {Vertex} fp 
   * @param {Vertex} cp 
   * @param {Edges} edges 
   * @param {Viewport} viewport 
   * @returns {Object.<string, DisplayVertex>}
   */
  getDisplayVerteces (fp, cp, edges, viewport) {
    /** @type {Object.<string, DisplayVertex>} */
    const displayVerteces = {};
    const fpTD = fp.toTopDown();
    const cpTD = cp.toTopDown();
    const fpToCP_topDown = new Vector2D(cpTD.x - fpTD.x, cpTD.y - fpTD.y);
    const convertedFP = new Vertex(0, fp.y);

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

    for (const p in this.vertextTable) {
      const vertex = new Vertex(
        (this.vertextTable[p].x * angles[0][0] + this.vertextTable[p].y * angles[0][1] + this.vertextTable[p].z * angles[0][2]) + this.pivot.x,
        (this.vertextTable[p].x * angles[1][0] + this.vertextTable[p].y * angles[1][1] + this.vertextTable[p].z * angles[1][2]) + this.pivot.y,
        (this.vertextTable[p].x * angles[2][0] + this.vertextTable[p].y * angles[2][1] + this.vertextTable[p].z * angles[2][2]) + this.pivot.z,
        this.vertextTable[p].options
      );
      displayVerteces[vertex.options.p] = vertex.toDisplayVertex(fpTD, convertedFP, fpToCP_topDown, edges, viewport);
    }

    if (this.#showPivot) {
      displayVerteces["__pivot-point__"] = this.pivot.toDisplayVertex(fpTD, convertedFP, fpToCP_topDown, edges, viewport);
    }

    return displayVerteces;
  }


  /**
   * @callback FrameAnimation
   * @param {number} delatTime
   * @param {R} lastState
   * @param {Object3D} thisArg
   * @returns {R}
   */
  /** @type {FrameAnimation} */
  #animation = (delatTime, lastState, thisArg) => {};

  /** @type {R} */
  #lastState;

  /**
   * @param {FrameAnimation} anime 
   */
  setAnimation (anime) {
    this.#animation = anime;
  }

  /**
   * @param {number} delatTime 
   */
  animate (delatTime) {
    this.#lastState = this.#animation(delatTime, this.#lastState, this);
  }












  /**
   * @param {HTMLElement} oElement 
   * @param {string} _id
   * @returns {Object3D=}
   */
  static fromElement (oElement, _id) {
    let id = oElement.getAttribute("id");
    const ref = oElement.getAttribute("ref");

    if (id == null && ref == null) {
      id = _id;
    }

    const isRef = id == null && ref != null;
    const obj = new Object3D(
      isRef ? ref : id,
      {},
      {},
      isRef
    );



    for (const child of oElement.children) {
      if (child.tagName == "VERTEX-TABLE") {
        obj.vertextTable = indexedTable(child, Vertex, "p");
      } else if (child.tagName == "LINE-TABLE") {
        obj.lineTable = indexedTable(child, Line, "p")
      }
    }

    return obj;
  }



  /**
   * @callback Object3DComponentArrayReducer
   * @param {Object.<string, Vertex>} map
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
}




















class Cube extends Object3D {
  constructor (id, size) {
    const verteces = [
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

    const vertexMap = verteces.reduce(Object3D.reduceArray, {});
    const lineMap = lines.reduce(Object3D.reduceArray, {});

    super(id, vertexMap, lineMap);
  }
}




















class Point extends Object3D {
  /**
   * @param {string} id 
   * @param {Vertex} position 
   */
  constructor (id, position) {
    const p = position.options.p ?? "0"
    position.options.p = p;
    
    const vertexTable = {};
    vertexTable[p] = position;
    
    super(id, vertexTable, {});
  }
}













class Renderer3D extends HTMLElement {
  static #resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      entry.target.__renders3D.forEach(e => e.recalcBounds());
    }
  });



  /** @type {string} */
  color;



  /** @type {number} */
  calcWidth = 100;
  /** @type {number} */
  calcHeight;



  /** @type {Object.<string, Object3D>} */
  objectTable = {};

  /**
   * @param {Object3D} object 
   */
  addObject (object) {
    this.objectTable[object.id] = object;
  }

  addObjects (...objects) {
    objects.forEach(o => this.addObject(o));
  }



  /** @type {{top: number, left: number}} */
  #parentTopLeft



  /** @type {number} */
  #yRotation = 0;
  


  /** @type {HTMLElement} */
  screen;
  
  /** @type {CanvasRenderingContext2D} */
  screenCtx;

  /** @type {Vertex=} */
  screenCenter;



  /** @type {Vertex=} */
  canvasPosition;

  /** @type {number} */
  canvasLength;
  


  /** @type {number} */
  focalLength;

  /** @type {Vertex=} */
  focalPoint;







  constructor () {
    super();
  }







  connectedCallback () {
    if (this.isConnected) {
      this.style.width = "100%";
      this.style.height = "100%";
      this.style.display = "block";

      if (this.parentElement.__renders3D == undefined) {
        this.parentElement.__renders3D = [this];
      } else {
        this.parentElement.__renders3D.push(this);
      }

      Renderer3D.#resizeObserver.observe(this.parentElement);

      this.#lastTimestamp = Date.now();

      window.addEventListener("load", evt => {
        for (const child of this.children) {
          if (child.tagName == "OBJECT-TABLE") {
            this.objectTable = indexedTable(child, Object3D, "id");
          }
        }

        this.textContent = "";
        this.screen = document.createElement("canvas");

        this.screenCtx = this.screen.getContext("2d");
        
        this.screen.style.width = "100%";
        this.screen.style.height = "100%";

        this.screen.width = this.parentElement.scrollWidth ?? this.parentElement.offsetWidth;
        this.screen.height = this.parentElement.scrollHeight ?? this.parentElement.offsetHeight;

        this.screenCenter = new Vertex(this.screen.width / 2, this.screen.height / 2, 0);
        this.canvasPosition = new Vertex(0, 0, Number(this.getAttribute("canvas-distance") ?? 75));
        this.canvasLength = 100;
        this.focalLength = Number(this.getAttribute("focal-length") ?? 75)
        this.focalPoint = new Vertex(0, 0, this.focalLength + this.canvasPosition.z);

        const src = this.getAttribute("src");
        if (src != null) {
          this.objFileParser(src);
        }

        this.appendChild(this.screen);


        this.addEventListener("mousemove", evt => {
          this.#yRotation = (evt.clientX - this.screenCenter.x + this.#parentTopLeft.left) / window.innerWidth * 2 * Math.PI;
          this.canvasPosition.y = (evt.clientY - this.screenCenter.y + this.#parentTopLeft.top) / window.innerHeight * 500;
        });

        this.addEventListener("wheel", evt => {
          this.canvasPosition.z = Math.max(Math.sign(evt.deltaY) * 20 + this.canvasPosition.z, -30);
        });


        requestAnimationFrame(this.drawFrame.bind(this));
      });
    }
  }







  /**
   * @param {Vertex} a Starting point of vector `v` (most likely a screen)
   * @param {Vector2D} v Vector A->B
   * @param {Vertex} c Starting point of vector `w`
   * @param {Vector2D} w Vector C->D
   * @returns {{t: number, r: number, intersects: boolean}} returns `t` parameter for parameter equasion of `a` and `v`
   */
  static getIntersectionRatio2D (a, v, c, w) {
    const t = (c.x * w.y + a.y * w.x - c.y * w.x - a.x * w.y) / (v.x * w.y - v.y * w.x);
    const r = (a.y * v.x + c.x * v.y - a.x * v.y - c.y * v.x) / (w.y * v.x - w.x * v.y);
    return ({ t, r, intersects: (0 <= t && t <= 1) && (0 <= r && r <= 1) });
  }







  recalcBounds () {
    const pw = this.parentElement.scrollWidth ?? this.parentElement.offsetWidth;
    const ph = this.parentElement.scrollHeight ?? this.parentElement.offsetHeight;

    this.calcHeight = 100 * (ph / pw);

    const {top, left} = this.parentElement.getBoundingClientRect();
    this.#parentTopLeft = {top, left};

    if (this.screen !== undefined) {
      this.screen.width = pw;
      this.screen.height = ph;

      this.screenCenter = new Vertex(this.screen.width / 2, this.screen.height / 2, 0);
    }
  }







  #stop = false;
  #lastTimestamp = 0;
  drawFrame () {
    this.screenCtx.clearRect(0, 0, this.screen.width, this.screen.height);
    const timestamp = Date.now();
    const delatTime = timestamp - this.#lastTimestamp;
    this.#lastTimestamp = timestamp;
    
    const cos = Math.cos(this.#yRotation);
    const sin = Math.sin(this.#yRotation);

    const rotatedFP = new Vertex(
      ((this.focalPoint.x + this.canvasPosition.x) * cos) - ((this.focalPoint.z + this.canvasPosition.z) * sin),
      this.canvasPosition.y * 1.15,
      ((this.focalPoint.z + this.canvasPosition.z) * cos) + ((this.focalPoint.x + this.canvasPosition.x) * sin)
    );
    
    const rotatedCP = new Vertex(
      (this.canvasPosition.x * cos) - (this.canvasPosition.z * sin), 
      this.canvasPosition.y,
      (this.canvasPosition.z * cos) + (this.canvasPosition.x * sin)
    );

    const convertedFP = new Vertex(0, rotatedFP.y);
    const cpToFP_rotated = new Vector2D(rotatedFP.x - rotatedCP.x, rotatedFP.z - rotatedCP.z); // for x
    
    const n1 = new Vector2D(-cpToFP_rotated.y, cpToFP_rotated.x);
    n1.scale(this.canvasLength);
    const n2 = new Vector2D(cpToFP_rotated.y, -cpToFP_rotated.x);
    n2.scale(this.canvasLength);

    const edges = {
      top: new Vertex(convertedFP.x - this.focalLength, (this.screen.height / this.screen.width * this.canvasLength / 2) + this.canvasPosition.y),
      bottom: new Vertex(convertedFP.x - this.focalLength, (-(this.screen.height / this.screen.width * this.canvasLength / 2) + this.canvasPosition.y)),
      leftTD: new Vertex(n2.x + rotatedCP.x, n2.y + rotatedCP.z),
      rightTD: new Vertex(n1.x + rotatedCP.x, n1.y + rotatedCP.z),
    };

    const viewport = {
      screen: {
        width: this.screen.width,
        height: this.screen.height
      },
      width: this.canvasLength,
      horizontalVector: new Vector2D(edges.rightTD.x - edges.leftTD.x, edges.rightTD.y - edges.leftTD.y),
      verticalVector: new Vector2D(edges.bottom.x - edges.top.x, edges.bottom.y - edges.top.y)
    };





    for (const objectID in this.objectTable) {
      const obj = this.objectTable[objectID];
      obj.animate(delatTime);

      const displayVerteces = obj.getDisplayVerteces(rotatedFP, rotatedCP, edges, viewport);
      for (const p in displayVerteces) {
        if (displayVerteces[p].doRender && displayVerteces[p].options.visibility != "hidden") {
          this.drawDisplayVertex(displayVerteces[p]);
        }
      }

      for (const p in obj.lineTable) {
        if (obj.lineTable[p].options.visibility != "hidden" && displayVerteces[obj.lineTable[p].start].doRender && displayVerteces[obj.lineTable[p].end].doRender) {
          this.drawLineFromDispVerteces(
            displayVerteces[obj.lineTable[p].start], 
            displayVerteces[obj.lineTable[p].end], 
            obj.lineTable[p].options.color
          );
        }
      }
    }


    // this.drawPoint(rotatedFP.x, rotatedFP.z, "blue")
    // this.drawLine(edges.leftTD.x, edges.leftTD.y, viewport.horizontalVector, "white");
    
    
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
   * 
   * @param {number} x 
   * @param {number} y
   * @param {string} color 
   */
  drawPoint (x, y, color, size = 4) {
    this.screenCtx.fillStyle = color;
    this.screenCtx.beginPath();
    this.screenCtx.arc(
      x + this.screenCenter.x - (size / 2),
      y + this.screenCenter.y - (size / 2),
      size,
      0,
      2 * Math.PI
    );
    this.screenCtx.fill();
  }
  
  
  
  /**
   * 
   * @param {number} x 
   * @param {number} y
   * @param {string} color 
   */
  drawPointAtZero (x, y, color) {
    const size = this.getSizeByDist()
    this.screenCtx.fillStyle = color;
    this.screenCtx.beginPath();
    this.screenCtx.arc(
      x - (size / 2),
      y - (size / 2),
      size,
      0,
      2 * Math.PI
    );
    this.screenCtx.fill();
  }
  
  
  
  /**
   * 
   * @param {DisplayVertex} dv
   */
  drawDisplayVertex (dv) {
    const size = this.getSizeByDist(dv.dist, dv.options.size);
    this.screenCtx.fillStyle = dv.options.color ?? "white";
    this.screenCtx.beginPath();
    this.screenCtx.arc(
      dv.x - (size / 2),
      dv.y - (size / 2),
      size,
      0,
      2 * Math.PI
    );
    this.screenCtx.fill();
  }







  /**
   * @param {number} startX 
   * @param {number} startY 
   * @param {Vector2D} vector 
   * @param {string} color 
   */
  drawLine (startX, startY, vector, color, size = 4) {
    this.screenCtx.strokeStyle = color;

    this.screenCtx.beginPath();
    this.screenCtx.moveTo(
      (this.screenCenter.x + startX - (size / 2)),
      (this.screenCenter.y + startY - (size / 2))
    );
    this.screenCtx.lineTo(
      (this.screenCenter.x + startX + vector.x - (size / 2)),
      (this.screenCenter.y + startY + vector.y - (size / 2))
    );
    this.screenCtx.stroke();
  }

  
  
  /**
   * @param {number} startX 
   * @param {number} startY 
   * @param {Vector2D} vector 
   * @param {string} color 
   */
  drawLineAtZero (startX, startY, vector, color, size = 4) {
    this.screenCtx.strokeStyle = color;

    this.screenCtx.beginPath();
    this.screenCtx.moveTo(
      (startX - (size / 2)),
      (startY - (size / 2))
    );
    this.screenCtx.lineTo(
      (startX + vector.x - (size / 2)),
      (startY + vector.y - (size / 2))
    );
    this.screenCtx.stroke();
  }

  
  
  /**
   * @param {DisplayVertex} start
   * @param {DisplayVertex} end
   * @param {Vector2D} vector 
   * @param {string} color 
   */
  drawLineFromDispVerteces (start, end, color = "white") {
    const startSize = this.getSizeByDist(start.dist, start.options.size);
    const endSize = this.getSizeByDist(end.dist, end.options.size);

    const dir = new Vector2D(end.x - start.x, end.y - start.y);
    const n1 = new Vector2D(dir.y, -dir.x);
    const n2 = new Vector2D(-dir.y, dir.x);
    const n3 = n1.clone();
    const n4 = n2.clone();

    n1.scale(startSize);
    n2.scale(startSize);
    n3.scale(endSize);
    n4.scale(endSize);

    this.screenCtx.fillStyle = color;
    this.screenCtx.beginPath();
    this.screenCtx.moveTo(start.x + n1.x - (startSize / 2), start.y + n1.y - (startSize / 2));
    this.screenCtx.lineTo(start.x + n2.x - (startSize / 2), start.y + n2.y - (startSize / 2));
    this.screenCtx.lineTo(end.x + n4.x - (endSize / 2), end.y + n4.y - (endSize / 2));
    this.screenCtx.lineTo(end.x + n3.x - (endSize / 2), end.y + n3.y - (endSize / 2));
    this.screenCtx.fill();
  }







  /**
   * @param {number} distance 
   * @returns 
   */
  getSizeByDist (distance, size = 2) {
    return size * this.focalLength / distance;
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
          const verteces = groups.map(s => /([0-9]+).{0,}/.exec(s)[1]);
          this.objCreateLines(verteces, ltable);
          break;
        }

        case "l": {
          const verteces = lines[i].substring(2).split(" ");
          this.objCreateLines(verteces, ltable);
          break s;
        }
      }
    }


    if (v != 1) {
      this.objRegisterObject(current, vtable, ltable);
    }
  }

  
  
  /**
   * @param {string[]} verteces 
   * @param {Object.<string, Line>} ltable 
   */
  objCreateLines (verteces, ltable) {
    if (verteces.length > 2) {
      verteces.push(verteces[0]);
    }

    for (let i = 0; i < (verteces.length - 1); i++) {
      const p = verteces[i] + "->" + verteces[i + 1];
      const pReversed = verteces[i + 1] + "->" + verteces[i];
      if (ltable[p] == undefined && ltable[pReversed] == undefined) {
        ltable[p] = new Line(verteces[i], verteces[i + 1], { p });
      }
    }
  }

  
  
  /**
   * @param {string} id 
   * @param {Object.<string, Vertex>} vtable 
   * @param {Object.<string, Line>} ltable 
   */
  objRegisterObject (id, vtable, ltable) {
    this.objectTable[id] = new Object3D(id, vtable, ltable);
    this.objectTable[id].scale(40);
    this.objectTable[id].setWireFrameSize(1);
  }
}

customElements.define("renderer-3d", Renderer3D);