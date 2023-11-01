import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import create, { SetState } from "zustand";
import type { Object3D } from "three";
import { OrbitControls } from "@react-three/drei";

type BoxData = {
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  x: number;
  y: number;
  z: number;
};

type Store = {
  target: Object3D | null;
  setTarget: (target: Object3D) => void;
};

const useStore = create<Store>((set: SetState<Store>) => ({
  target: null,
  setTarget: (target: Object3D) => set({ target }),
}));

function Box(props: BoxData & { forwardedRef: any; onSelect: () => void }) {
  const setTarget = useStore((state) => state.setTarget);

  return (
    <mesh
      position={[props.x, props.y, props.z]}
      scale={[props.sizeX, props.sizeY, props.sizeZ]}
      ref={props.forwardedRef}
      onClick={(e) => {
        setTarget(e.object);
        props.onSelect();
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  );
}

export default function App() {
  const [boxSizeX, setBoxSizeX] = useState<number>(1);
  const [boxSizeY, setBoxSizeY] = useState<number>(1);
  const [boxSizeZ, setBoxSizeZ] = useState<number>(1);
  const [selectedBoxSize, setSelectedBoxSize] = useState<BoxData | null>(null);

  const [boxes, setBoxes] = useState<BoxData[]>([
    { sizeX: 1, sizeY: 1, sizeZ: 1, x: 0, y: 0, z: 0 }
  ]);
  const target = useStore((state) => state.target);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [transformMode, setTransformMode] = useState<"scale" | "rotate" | "translate">("translate");

  const addBox = () => {
    const newBoxData: BoxData = {
      sizeX: boxSizeX,
      sizeY: boxSizeY,
      sizeZ: boxSizeZ,
      x: 0,
      y: 0,
      z: 0
    };
    setBoxes(prev => [...prev, newBoxData]);
  };
  const deleteSelectedBox = () => {
    if (selectedBoxIndex !== null) {
      setBoxes(prev => prev.filter((_, idx) => idx !== selectedBoxIndex));
      setSelectedBoxIndex(null);
    }
  };
  const selectBox = (idx: number) => {
    setSelectedBoxIndex(idx);
    setSelectedBoxSize(boxes[idx]);
  };

  const updateSelectedBoxSize = () => {
    if (selectedBoxSize && selectedBoxIndex !== null) {
      setBoxes(prev => 
        prev.map((box, idx) => 
          idx === selectedBoxIndex ? selectedBoxSize : box
        )
      );
    }
  };

  return (
    <div className="h-screen w-full">
      <Canvas className="h-full w-full">
        <ambientLight intensity={0.5} />
        <directionalLight color="red" position={[0, 0, 5]} />
        {boxes.map((box, idx) => (
          <Box
            key={idx}
            {...box}
            forwardedRef={idx === selectedBoxIndex ? target : null}
            onSelect={() => selectBox(idx)}
          />
        ))}
        {target && <TransformControls object={target} mode={transformMode} />}
        <OrbitControls makeDefault />
      </Canvas>

      <div>
        <label>
          Width (X):
          <input
            type="number"
            className="text-black"
            value={boxSizeX}
            onChange={e => setBoxSizeX(Number(e.target.value))}
          />
        </label>
        <label>
          Height (Y):
          <input
            type="number"
            className="text-black"
            value={boxSizeY}
            onChange={e => setBoxSizeY(Number(e.target.value))}
          />
        </label>
        <label>
          Depth (Z):
          <input
            type="number"
            className="text-black"
            value={boxSizeZ}
            onChange={e => setBoxSizeZ(Number(e.target.value))}
          />
        </label>

        <button onClick={addBox}>Add Box</button>
      </div>

      <div>
        {selectedBoxSize && (
          <>
            <h3>Selected Box Dimensions:</h3>
            <label>
              Width (X):
              <input
                type="number"
                className="text-black"
                value={selectedBoxSize.sizeX}
                onChange={e =>
                  setSelectedBoxSize(prev => ({ ...prev!, sizeX: Number(e.target.value) }))
                }
              />
            </label>
            <label>
              Height (Y):
              <input
                type="number"
                className="text-black"
                value={selectedBoxSize.sizeY}
                onChange={e =>
                  setSelectedBoxSize(prev => ({ ...prev!, sizeY: Number(e.target.value) }))
                }
              />
            </label>
            <label>
              Depth (Z):
              <input
                type="number"
                className="text-black"
                value={selectedBoxSize.sizeZ}
                onChange={e =>
                  setSelectedBoxSize(prev => ({ ...prev!, sizeZ: Number(e.target.value) }))
                }
              />
            </label>

            <button onClick={updateSelectedBoxSize}>Update Selected Box Size</button>

            {selectedBoxIndex !== null && <button onClick={deleteSelectedBox}>Delete Selected Box</button>}
          </>
        )}
      </div>

      <div>
        <button onClick={() => setTransformMode("translate")}>Translate</button>
        <button onClick={() => setTransformMode("rotate")}>Rotate</button>
        <button onClick={() => setTransformMode("scale")}>Scale</button>
      </div>
    </div>
  );
}
