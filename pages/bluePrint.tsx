import "../styles/globals.css";
import "../styles/style.css";
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  TransformControls,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import create, { SetState } from "zustand";
import type { Object3D } from "three";
import LogOut from "../components/inputHelpers/logout";

type BoxData = {
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  x: number;
  y: number;
  z: number;
  texture: string;
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
  const textureMap = useTexture(`/textures/${props.texture}.jpg`);

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
      <meshBasicMaterial map={textureMap} />
    </mesh>
  );
}

const BluePrint = (props : any) => {
  const [boxSizeX, setBoxSizeX] = useState<number>(1);
  const [boxSizeY, setBoxSizeY] = useState<number>(1);
  const [boxSizeZ, setBoxSizeZ] = useState<number>(1);
  const [selectedBoxSize, setSelectedBoxSize] = useState<BoxData | null>(null);
  const [boxes, setBoxes] = useState<BoxData[]>([
    { sizeX: 1, sizeY: 1, sizeZ: 1, x: 0, y: 0, z: 0, texture: "default" },
  ]);
  const target = useStore((state) => state.target);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [transformMode, setTransformMode] = useState<
    "scale" | "rotate" | "translate"
  >("translate");

  const addBox = () => {
    const newBoxData: BoxData = {
      sizeX: boxSizeX,
      sizeY: boxSizeY,
      sizeZ: boxSizeZ,
      x: 0,
      y: 0,
      z: 0,
      texture: "default",
    };
    setBoxes((prev) => [...prev, newBoxData]);
  };

  const deleteSelectedBox = () => {
    if (selectedBoxIndex !== null) {
      setBoxes((prev) => prev.filter((_, idx) => idx !== selectedBoxIndex));
      setSelectedBoxIndex(null);
    }
  };

  const selectBox = (idx: number) => {
    setSelectedBoxIndex(idx);
    setSelectedBoxSize(boxes[idx]);
  };

  const updateSelectedBoxSize = () => {
    if (selectedBoxSize && selectedBoxIndex !== null) {
      setBoxes((prev) =>
        prev.map((box, idx) =>
          idx === selectedBoxIndex ? selectedBoxSize : box
        )
      );
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      <div className="col-span-2">
        <div className="h-screen w-full">
          <Canvas className="w-full h-full">
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
            {target && (
              <TransformControls object={target} mode={transformMode} />
            )}
            <OrbitControls makeDefault />
          </Canvas>
        </div>
      </div>
      <div className="col-span-1 m-2 dark:bg-slate-800 bg-slate-400 rounded-xl items-center justify-center h-auto">
        <nav className="m-2 bg-slate-600 rounded-xl flex justify-between items-center">
          <h1
            onClick={() => location.reload()}
            className="m-2 text-5xl text-left text-white font-bold"
          >
            PlanFlow3D
          </h1>
          <LogOut />
        </nav>
        <div className="p-2">
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="mb-1 text-gray-600">Width (X):</label>
              <input
                type="number"
                step="0.01"
                className="p-2 w-full border rounded-md text-black"
                value={boxSizeX}
                onChange={(e) => setBoxSizeX(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-600">Height (Y):</label>
              <input
                type="number"
                step="0.01"
                className="p-2 w-full border rounded-md text-black"
                value={boxSizeY}
                onChange={(e) => setBoxSizeY(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-600">Depth (Z):</label>
              <input
                type="number"
                step="0.01"
                className="p-2 w-full border rounded-md text-black"
                value={boxSizeZ}
                onChange={(e) => setBoxSizeZ(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-center items-center">
              <button
                onClick={addBox}
                className="bg-slate-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Box
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {selectedBoxSize && (
              <>
                <h3 className="text-xl font-bold text-white">
                  Selected Box Dimensions:
                </h3>
                <div className="flex flex-col">
                  <label className="mb-1 text-gray-600">Width (X):</label>
                  <input
                    type="number"
                    step="0.01"
                    className="p-2 w-full border rounded-md text-black"
                    value={selectedBoxSize.sizeX}
                    onChange={(e) =>
                      setSelectedBoxSize((prev) => ({
                        ...prev!,
                        sizeX: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-gray-600">Height (Y):</label>
                  <input
                    type="number"
                    step="0.01"
                    className="p-2 w-full border rounded-md text-black"
                    value={selectedBoxSize.sizeY}
                    onChange={(e) =>
                      setSelectedBoxSize((prev) => ({
                        ...prev!,
                        sizeY: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-gray-600">Depth (Z):</label>
                  <input
                    type="number"
                    step="0.01"
                    className="p-2 w-full border rounded-md text-black"
                    value={selectedBoxSize.sizeZ}
                    onChange={(e) =>
                      setSelectedBoxSize((prev) => ({
                        ...prev!,
                        sizeZ: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-gray-600">
                    Texture for selected box:
                  </label>
                  <select
                    className="p-2 w-full border rounded-md"
                    value={selectedBoxSize.texture}
                    onChange={(e) =>
                      setSelectedBoxSize((prev) => ({
                        ...prev!,
                        texture: e.target.value,
                      }))
                    }
                  >
                    <option value="default">Default</option>
                    <option value="stone">Csempe</option>
                    <option value="wood">Fa</option>
                    <option value="carpet">Szönyeg</option>
                  </select>
                </div>

                <button
                  onClick={updateSelectedBoxSize}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Update Selected Box Size
                </button>
                {selectedBoxIndex !== null && (
                  <button
                    onClick={deleteSelectedBox}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete Selected Box
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flex justify-center items-center space-x-2 mt-4">
            <button
              onClick={() => setTransformMode("translate")}
              className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded-full shadow-md hover:shadow-lg"
            >
              Translate
            </button>
            <button
              onClick={() => setTransformMode("rotate")}
              className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded-full shadow-md hover:shadow-lg"
            >
              Rotate
            </button>
            <button
              onClick={() => setTransformMode("scale")}
              className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded-full shadow-md hover:shadow-lg"
            >
              Scale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BluePrint;
