const SIZE = 4;
    this.screenCtx.clearRect(0, 0, this.screen.width, this.screen.height);



    const cos = Math.cos(this.#yRotation);
    const sin = Math.sin(this.#yRotation);
    const rotatedFP = new Vertex(
      ((this.focalPoint.x + this.canvasPosition.x) * cos) - ((this.focalPoint.z + this.canvasPosition.z) * sin),
      0,
      ((this.focalPoint.z + this.canvasPosition.z) * cos) + ((this.focalPoint.x + this.canvasPosition.x) * sin)
    );
    const rotatedCP = new Vertex(
      (this.canvasPosition.x * cos) - (this.canvasPosition.z * sin), 
      0, 
      (this.canvasPosition.z * cos) + (this.canvasPosition.x * sin)
    );

    

    const vertecies = [
      new Vertex(50, 50, 50),
      new Vertex(50, 50, -50),
      new Vertex(50, -50, 50),
      new Vertex(50, -50, -50),
      new Vertex(-50, 50, 50),
      new Vertex(-50, 50, -50),
      new Vertex(-50, -50, 50),
      new Vertex(-50, -50, -50),
    ];
    
    // const n1 = new Vector2D(-vectToFocal.y, vectToFocal.x);
    // n1.scale(this.canvasLength);
    // const n2 = new Vector2D(vectToFocal.y, -vectToFocal.x);
    // n2.scale(this.canvasLength);


    const vertex = new Vertex(50, 40, 30); // c
    
    // get projected x
    // const rightEdge = new Vertex(n1.x + rotatedCP.x, rotatedCP.y, n1.y + rotatedCP.z);
    // const leftEdge = new Vertex(n2.x + rotatedCP.x, rotatedCP.y, n2.y + rotatedCP.z);
    // const widthVect = new Vector2D(rightEdge.x - leftEdge.x, rightEdge.z - leftEdge.z); // v

    // const vertexToFP = new Vector2D(rotatedFP.x - vertex.x, rotatedFP.z - vertex.z); // w
    
    // const a = leftEdge.toTopDown();
    // const c = vertex.toTopDown();
    // const ratio = Renderer3D.getIntersectionRatio2D(a, widthVect, c, vertexToFP);

    // const intersectionPoint = widthVect.getVertex(a, ratio.t);

    // const distance = new Vector2D(c.x - intersectionPoint.x, c.y - intersectionPoint.y).length;
    
    // if (ratio.intersects) {
    //   const projectedX = this.screen.width - this.screen.width * ratio.t;

    //   this.drawPoint(projectedX - this.screenCenter.x, this.screen.height - 50 - this.screenCenter.y, "white", this.getSizeByDist(distance));
    //   this.drawPoint(intersectionPoint.x, intersectionPoint.y, "green");
    // }