import "../styles/globals.css";
import "../styles/style.css";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Canvas, useLoader } from "@react-three/fiber";
import ProtectedRoute from "./protectedRouteProps";
import {
  Box,
  TransformControls,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import LogOut from "@/components/inputHelpers/logout";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { texture } from "three/examples/jsm/nodes/Nodes.js";
import { TextureLoader } from "three";
import { Object3D } from "three";
import create from "zustand";
import { Mesh } from "three";

type FloorProps = {
  data: Array<{
    x: number;
    y: number;
    z: number;
    SizeX: number;
    SizeY: number;
    SizeZ: number;
    texture: string; // Feltételezve, hogy van egy texture nevű string tulajdonság
  }>;
  forwardedRef?: React.Ref<any>;
  onSelect?: () => void;
};

const useStore = create<{
  selectedModel: Object3D | null;
  setSelectedModel: (model: Object3D | null) => void;
}>((set) => ({
  selectedModel: null,
  setSelectedModel: (model) => set({ selectedModel: model }),
}));

const Floor: React.FC<FloorProps> = (props) => {
  return props.data.map((item, index) => {
    const textureMap = useTexture(`/textures/${item.texture}.jpg`);
    return (
      <mesh
        key={index}
        position={[item.x, item.y, item.z]}
        scale={[item.SizeX, item.SizeY, item.SizeZ]}
        ref={props.forwardedRef}
        onClick={() => props.onSelect && props.onSelect()}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial map={textureMap} />
      </mesh>
    );
  });
};

type STLModelProps = {
  url: string;
  position: [number, number, number];
  scale: [number, number, number];
};

const STLModel: React.FC<STLModelProps> = ({ url, position, scale }) => {
  const geometry = useLoader(STLLoader, url);
  const meshRef = useRef<Mesh>(null); // Itt használjuk a Mesh típust
  const { setSelectedModel } = useStore();

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={position}
      scale={scale}
      onClick={() => setSelectedModel(meshRef.current)}
    >
      <meshPhongMaterial color={"gray"} />
    </mesh>
  );
};

const RoomPlanner = () => {
  const router = useRouter();
  const [blueprintData, setBlueprintData] = useState<FloorProps | null>(null);
  const { selectedModel, setSelectedModel } = useStore();

  useEffect(() => {
    // A router.query aszinkron viselkedése miatt ellenőrizzük, hogy a blueprintId már rendelkezésre áll-e
    const handleLoadBlueprint = async () => {
      const blueprintId = router.query.blueprintId as string | undefined;

      if (blueprintId) {
        try {
          const response = await fetch(`/api/bluePrints?id=${blueprintId}`);
          const data = await response.json();
          if (response.ok) {
            setBlueprintData(data);
            console.log("Alaprajz betöltve:", data);
          } else {
            throw new Error(
              data.message || "Nem sikerült betölteni az alaprajzot."
            );
          }
        } catch (error) {
          console.error("Hiba történt az alaprajz betöltésekor:", error);
        }
      }
    };

    if (router.isReady) {
      handleLoadBlueprint();
    }
  }, [router.isReady, router.query.blueprintId]);

  // Itt jön a return rész, amit kérésed szerint kihagyok
  return (
    <ProtectedRoute>
      <div className="grid grid-cols-3 gap-4 h-full">
        <div className="col-span-2 h-screen">
          <Canvas>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <ambientLight intensity={0.5} />
            <STLModel
              url="/stls/FridgeSmall.stl"
              position={[0, 0, 0]}
              scale={[1, 1, 1]}
            />
            <STLModel
              url="/stls/1SeatDollhouseChair-base.stl"
              position={[5, 5, 5]}
              scale={[1, 1, 1]}
            />
            {selectedModel && (
              <TransformControls
                object={selectedModel}
                mode="translate" // vagy 'rotate', 'scale'
                onChange={() => setSelectedModel(null)}
              />
            )}

            {blueprintData && (
              <Floor
                {...blueprintData}
                onSelect={() => {
                  // Kezelje az eseményt, amikor a felhasználó kiválaszt egy elemet
                }}
              />
            )}
            <directionalLight />
            <OrbitControls makeDefault />
          </Canvas>
        </div>

        <div className="col-span-1 m-2 dark:bg-slate-800 bg-slate-400 rounded-xl items-center justify-center h-auto min-w-full">
          <nav className="m-2 bg-slate-600 rounded-xl flex justify-between items-center">
            <h1
              onClick={() => location.reload()}
              className="m-2 text-5xl text-left text-white font-bold"
            >
              PlanFlow3D
            </h1>
            <LogOut />
          </nav>

          <div className="mb-4">
            <label className="block mb-2 text-white">Upload STL:</label>
            <input type="file" className="p-2 bg-gray-700 text-white rounded" />
            {/* TODO: STL fájlok feltöltése és tárolása. */}
          </div>

        
          <div className="mb-4">
            <label className="block mb-2 text-white">Add STL To room:</label>
            
            {/* TODO: STL fájlok feltöltése és tárolása. */}
          </div>

          {/* Mentés és Exportálás */}
          <div className="flex justify-between">
            <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded">
              Save Layout
            </button>
            {/* TODO: Jelenlegi elrendezés mentése. */}

            
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};
export default RoomPlanner;
