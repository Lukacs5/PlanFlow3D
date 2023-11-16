import "../styles/globals.css";
import "../styles/style.css";
import React, { useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  TransformControls,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import create, { SetState } from "zustand";
import { Object3D } from "three";
import LogOut from "../components/inputHelpers/logout";
import ProtectedRoute from "./protectedRouteProps";

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

const BluePrint = (props) => {
  const [name, setName] = useState("");
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

  const getUserIdByEmail = async (email: string) => {
    try {
      const email: string = localStorage.getItem("userEmail") || "ERROR";
      const response = await fetch(
        `/api/getUserId?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.userId; // feltételezve, hogy a válasz JSON objektuma tartalmaz egy `userId` kulcsot
      } else {
        throw new Error("A hálózati válasz nem volt rendben.");
      }
    } catch (error) {
      console.error(
        "Hiba történt a felhasználói azonosító lekérésekor:",
        error
      );
      return null; // vagy dobhat egy hibát, attól függően, hogy szeretné kezelni a hibákat
    }
  };

  const saveToDatabase = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      const userId = userEmail ? await getUserIdByEmail(userEmail) : null;

      // Ellenőrizzük, hogy kaptunk-e userId-t
      if (!userId) {
        console.error("Nem sikerült lekérni a userId-t.");
        return;
      }

      // Most már van userId-nk, elvégezhetjük a POST kérést
      const response = await fetch("/api/bluePrintSave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boxesData: boxes,
          userId: userId,
          img: "https://i.imgur.com/gr0S0QQ.png", //gl.domElement.toDataURL("image/png"),
          name: name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Adatok sikeresen elmentve:", data.data);
        window.location.href = `/roomPlanner?blueprintId=${data.data.id}`;
      } else {
        console.error("Hiba az adatok mentése közben:", data.error);
      }
    } catch (error) {
      console.error("Hiba az API hívás során:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="grid grid-cols-3 gap-4 h-full">
        <div className="col-span-2">
          <div className="h-screen w-full">
            <Canvas
              gl={{ preserveDrawingBuffer: true }}
              className="w-full h-full"
            >
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
                <TransformControls
                  object={target}
                  mode={transformMode}
                  onChange={(event) => {
                    // Itt feltételezzük, hogy az 'event' egy 'Object3D' típusú objektumot tartalmaz

                    if (event && selectedBoxIndex !== null) {
                      const updatedBoxData = {
                        ...boxes[selectedBoxIndex],
                        x: target.position.x,
                        y: target.position.y,
                        z: target.position.z,
                        SizeX: target.scale.x,
                        SizeY: target.scale.y,
                        SizeZ: target.scale.z,

                        // Itt szükség lehet a scale és rotation értékek kezelésére is
                      };
                      console.log("Helyzet:", target.position);
                      console.log("Méret:", target.scale);
                      // Frissítsd a kiválasztott doboz adatait
                      setBoxes((prev) =>
                        prev.map((box, idx) =>
                          idx === selectedBoxIndex ? updatedBoxData : box
                        )
                      );

                      // setBoxes((prev) => prev.map((box, idx) => idx === selectedBoxIndex ? selectedBoxSize : box));
                    }
                  }}
                />
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
            <div className=" my-4 block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="space-y-1">
                <div className="flex flex-col">
                  <label className="mb-1 mt-2 text-gray-300 font-bold">Width (X):</label>
                  <input
                    type="number"
                    step="0.01"
                    className="p-2 w-full border rounded-md text-black"
                    value={boxSizeX}
                    onChange={(e) => setBoxSizeX(Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 mt-2 text-gray-300 font-bold">Height (Y):</label>
                  <input
                    type="number"
                    step="0.01"
                    className="p-2 w-full border rounded-md text-black"
                    value={boxSizeY}
                    onChange={(e) => setBoxSizeY(Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 mt-2 text-gray-300 font-bold">Depth (Z):</label>
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
                    className="bg-slate-500 hover:bg-blue-700 text-white font-bold py-2 mt-4 px-4 rounded"
                  >
                    Add Box
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {selectedBoxSize && 
              (
                <>
                 <div className=" my-4 block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-center text-white">
                    Selected Box Dimensions:
                  </h3>
                  <div className="flex flex-col">
                    <label className="mb-1 mt-2 text-gray-300 font-bold">Width (X):</label>
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
                    <label className="mb-1 mt-2 text-gray-300 font-bold">Height (Y):</label>
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
                    <label className="mb-1 mt-2 text-gray-300 font-bold">Depth (Z):</label>
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
                    <label className="mb-1 mt-2 text-gray-300 font-bold">
                      Texture for selected box:
                    </label>
                    <select
                      className="p-2 w-full border rounded-md text-black"
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

                  <div className="flex justify-center items-center"><button
                    onClick={updateSelectedBoxSize}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-80 rounded my-4"
                  >
                     Kijelölt Doboz Frissités
                  </button></div>
                  {selectedBoxIndex !== null && (
                    <div className="flex justify-center items-center"><button
                      onClick={deleteSelectedBox}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 w-80 px-4 rounded"
                    >
                      Kijelölt Doboz Törlése
                    </button></div>
                  )}
</div>
                </>
              )
              }
            </div>

            <div className="flex justify-center items-center space-x-2 my-4">
              <button
                onClick={() => setTransformMode("translate")}
                className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded shadow-md hover:shadow-lg"
              >
                Transfor
              </button>
              <button
                onClick={() => setTransformMode("rotate")}
                className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded shadow-md hover:shadow-lg"
              >
                Rotate
              </button>
              <button
                onClick={() => setTransformMode("scale")}
                className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded shadow-md hover:shadow-lg"
              >
                Scale
              </button>
            </div>
            <div className="flex justify-center items-center m-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="p-2 border rounded text-black"
              />
              <button
                onClick={saveToDatabase}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
              >
                Save Box Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BluePrint;
