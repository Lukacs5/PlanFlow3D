import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const YourComponent: React.FC = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer();
  const cubeGeometry = new THREE.BoxGeometry();
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  const isDragging = useRef(false);
  const previousX = useRef(0);

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    isDragging.current = true;
    previousX.current = event.clientX;
  };

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!isDragging.current) return;

    const deltaX = event.clientX - previousX.current;
    previousX.current = event.clientX;

    // Kezelje az egérmozgást itt
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // ...
  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    // Az egér görgetés eseménykezelő itt kezelhető
  };
  // ...

  useEffect(() => {
    if (divRef.current) {
      const yourDiv = divRef.current;

      const updateRendererSize = () => {
        const newWidth = yourDiv.clientWidth;
        const newHeight = yourDiv.clientHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
      };

      renderer.setSize(yourDiv.clientWidth, yourDiv.clientHeight);
      yourDiv.appendChild(renderer.domElement);

      window.addEventListener("resize", updateRendererSize);
      updateRendererSize();

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(200, 500, 300);
      scene.add(directionalLight);

      // L alak csoportja
      const lShape = new THREE.Group();

      // Falak hozzáadása
      const wall1 = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.2, 1),
        new THREE.MeshLambertMaterial({ color: 0x888888 })
      );
      wall1.position.set(2, 0.1, 1);
      lShape.add(wall1);

      const wall2 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.2, 2),
        new THREE.MeshLambertMaterial({ color: 0x888888 })
      );
      wall2.position.set(2.5, 0.1, 0);
      lShape.add(wall2);

      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1.3, 0.3),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );

      scene.add(lShape);

      scene.add(cabin);
      cabin.position.x += 1;
      //scene.add(cube);

      camera.position.set(2, 0, 5);

      // Render loop
      const animate = () => {
        requestAnimationFrame(animate);
        cabin.rotateY(0.002);

        lShape.rotateY(0.003)
        lShape.rotateX(0.003)

        //cube.rotation.x += 0.002;
       // cube.rotation.y += 0.002;

        renderer.render(scene, camera);
      };

      animate();
    }
  }, []);

  return (
    <div
      ref={divRef}
      style={{ width: "100%", height: "100vh" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* A Three.js jelenet itt jelenik meg */}
    </div>
  );
};

export default YourComponent;
