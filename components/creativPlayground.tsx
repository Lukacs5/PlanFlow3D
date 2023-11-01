import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import create, { SetState } from "zustand";
import type { Object3D } from "three";
import { OrbitControls } from "@react-three/drei";
type Store = {
  target: Object3D | null;
  setTarget: (target: Object3D) => void;
};

const useStore = create<Store>((set: SetState<Store>) => ({
  target: null,
  setTarget: (target: Object3D) => set({ target }),
}));

function Box(props: any) {
  const setTarget = useStore((state) => state.setTarget);
  const [hovered, setHovered] = useState(false);
 

  return (
    <mesh
      {...props}
      ref={props.forwardedRef}
      onClick={(e) => {
        setTarget(e.object);
        props.onSelect();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry />
      <meshNormalMaterial />
    </mesh>
  );
}

export default function App() {
  const [boxes, setBoxes] = useState([{ x: 0, y: 0, z: 0 }]);
  const target = useStore((state) => state.target);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [transformMode, setTransformMode] = useState<'scale' | 'rotate' | 'translate'>('translate');
  const addBox = () => {
    const newBoxPosition = {
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 10,
    };
    setBoxes((prevBoxes) => [...prevBoxes, newBoxPosition]);
  };

  return (
    <div className="h-screen w-full">
      <Canvas className="h-full w-full">
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        {boxes.map((box, idx) => (
          <Box
            key={idx}
            position={[box.x, box.y, box.z]}
            forwardedRef={idx === selectedBoxIndex ? target : null}
            onSelect={() => setSelectedBoxIndex(idx)}
          />
        ))}
        {target && <TransformControls object={target} mode={transformMode} />}
        <OrbitControls makeDefault/>
      </Canvas>
      <button onClick={addBox}>Add Box</button>
      <div>
        <button onClick={() => setTransformMode('translate')}>Translate</button>
        <button onClick={() => setTransformMode('rotate')}>Rotate</button>
        <button onClick={() => setTransformMode('scale')}>Scale</button>
      </div>
    </div>
  );
}
