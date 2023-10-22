import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const CreativPlayground: React.FC = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newRenderer = new THREE.WebGLRenderer();
      setRenderer(newRenderer);

      const yourDiv = divRef.current;

      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      const scene = new THREE.Scene();

      const updateRendererSize = () => {
        const newWidth = yourDiv?.clientWidth || 100;
        const newHeight = yourDiv?.clientHeight || 100;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        newRenderer.setSize(newWidth, newHeight);
      };

      newRenderer.setSize(yourDiv?.clientWidth || 5, yourDiv?.clientHeight || 5);
      yourDiv?.appendChild(newRenderer.domElement);

      window.addEventListener("resize", updateRendererSize);
      updateRendererSize();

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(200, 500, 300);
      scene.add(directionalLight);

      const lShape = new THREE.Group();

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

      camera.position.set(2, 0, 5);

      const animate = () => {
        requestAnimationFrame(animate);
        cabin.rotateY(0.002);
        lShape.rotateY(0.003);
        lShape.rotateX(0.003);
        newRenderer.render(scene, camera);
      };

      animate();
    }
  }, []);

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    // ... a kódod
  };

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    // ... a kódod
  };

  const handleMouseUp = () => {
    // ... a kódod
  };

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    // ... a kódod
  };

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

export default CreativPlayground;
