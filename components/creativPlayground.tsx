import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

const CreativPlayground: React.FC = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newRenderer = new THREE.WebGLRenderer();

      const yourDiv = divRef.current;
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      const scene = new THREE.Scene();

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let setIsMouseDown = false;
      function onMouseDown(event: MouseEvent) {
        return setIsMouseDown = true ;
      }
      function onMouseUp(event: MouseEvent) {
        return setIsMouseDown = false ;
    }

      function onMouseMove(event: MouseEvent) {
        if (!divRef.current) return;
        // Az egér pozíciójának normalizálása, hogy az értékek -1 és 1 között legyenek
        const rect = divRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
      }
      setRenderer(newRenderer);

      const updateRendererSize = () => {
        const newWidth = yourDiv?.clientWidth || 100;
        const newHeight = yourDiv?.clientHeight || 100;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        newRenderer.setSize(newWidth, newHeight);
      };

      newRenderer.setSize(
        yourDiv?.clientWidth || 5,
        yourDiv?.clientHeight || 5
      );
      yourDiv?.appendChild(newRenderer.domElement);

      window.addEventListener("resize", updateRendererSize);
      window.addEventListener("mousemove", onMouseMove, false);

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
      const cabin2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1.3, 3.3),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );

      const cabin3 = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1.3, 2.3),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );

      const wall1Geometry = new THREE.BoxGeometry(2, 0.2, 1);
      wall1Geometry.translate(2, 0.1, 1);

      const wall2Geometry = new THREE.BoxGeometry(1, 0.2, 2);
      wall2Geometry.translate(2.5, 0.1, 0);

      const mergedGeometry = BufferGeometryUtils.mergeGeometries([
        wall1Geometry,
        wall2Geometry,
      ]);

      const lShape2 = new THREE.Mesh(
        mergedGeometry,
        new THREE.MeshLambertMaterial({ color: 0x888888 })
      );

      //scene.add(lShape);
      scene.add(lShape2);
      scene.add(cabin);
      scene.add(cabin2);
      scene.add(cabin3);
      cabin.position.x += 1;

      const controls = new OrbitControls(camera, newRenderer.domElement);
      const transformControls = new TransformControls(
        camera,
        newRenderer.domElement
      );
      scene.add(transformControls);
      //transformControls.attach(cabin);
      //transformControls.attach(lShape);

      transformControls.addEventListener("dragging-changed", function (event) {
        controls.enabled = !event.value;
      });

      camera.position.set(2, 0, 5);

     
      window.addEventListener("mousedown", onMouseDown, false);
      window.addEventListener("mouseup", onMouseUp, false);
      const animate = () => {
        requestAnimationFrame(animate);
        //cabin.rotateY(0.002);
        //lShape.rotateY(0.003);
        //lShape.rotateX(0.003);
        newRenderer.render(scene, camera);

        /*
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length >= 0) {
          const objectUnderMouse = intersects[0].object;
          console.log(objectUnderMouse);
          transformControls.attach(cabin);
         
        }*/

        const interactableObjects = [cabin, lShape2, cabin2, cabin3]; // és bármely más objektum, amelyet hozzáadott a jelenethez

        // ...

        

        const intersects = raycaster.intersectObjects(interactableObjects);
        if (intersects.length > 0 && setIsMouseDown) {
          const objectUnderMouse = intersects[0].object;
          console.log(objectUnderMouse);
          transformControls.attach(objectUnderMouse);
        }
      };

      animate();
    }
  }, []);

  return (
    <div ref={divRef} style={{ width: "100%", height: "100vh" }}>
      {/* A Three.js jelenet itt jelenik meg */}
    </div>
  );
};

export default CreativPlayground;
