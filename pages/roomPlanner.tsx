import "../styles/globals.css";
import "../styles/style.css";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Canvas, useLoader } from "@react-three/fiber";
import ProtectedRoute from "./protectedRouteProps";
import {
  TransformControls,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import LogOut from "@/components/inputHelpers/logout";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { Object3D } from "three";
import create from "zustand";
import { Mesh } from "three";
import { randFloat } from "three/src/math/MathUtils.js";

type STLFile = {
  filename: string;
  fileRoot: string;
  // További mezők, ha vannak
};

type StlData = {
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  x: number;
  y: number;
  z: number;
};

type FloorProps = {
  data: Array<{
    x: number;
    y: number;
    z: number;
    SizeX: number;
    SizeY: number;
    SizeZ: number;
    texture: string;
  }>;
  onSelect?: () => void;
};

type FloorTileProps = {
  item: {
    x: number;
    y: number;
    z: number;
    SizeX: number;
    SizeY: number;
    SizeZ: number;
    texture: string;
  };
  onSelect?: () => void;
};

const useStore = create<{
  selectedModel: Object3D | null;
  setSelectedModel: (model: Object3D | null, modelUrl: string) => void;
  selectedModelUrl: string;
  setSelectedModelUrl: (modelUrl: string) => void;
}>((set) => ({
  selectedModel: null,
  selectedModelUrl: "",
  setSelectedModel: (model, modelUrl) =>
    set({ selectedModel: model, selectedModelUrl: modelUrl }),
  setSelectedModelUrl: (modelUrl) => set({ selectedModelUrl: modelUrl }),
}));

const FloorTile: React.FC<FloorTileProps> = ({ item, onSelect }) => {
  const textureMap = useTexture(`/textures/${item.texture}.jpeg`);
  return (
    <mesh
      position={[item.x, item.y, item.z]}
      scale={[item.SizeX, item.SizeY, item.SizeZ]}
      onClick={onSelect}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial map={textureMap} />
    </mesh>
  );
};

const Floor: React.FC<FloorProps> = ({ data, onSelect }) => {
  return (
    <>
      {data.map((item, index) => (
        <FloorTile key={index} item={item} onSelect={onSelect} />
      ))}
    </>
  );
};

type STLModelProps = {
  url: string;
  position: [number, number, number];
  scale: [number, number, number];
  onSelect: () => void;
};

const STLModel: React.FC<STLModelProps> = ({
  url,
  position,
  scale,
  onSelect,
}) => {
  const geometry = useLoader(STLLoader, url);
  const meshRef = useRef<Mesh>(null);
  const { setSelectedModel, setSelectedModelUrl } = useStore();

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={position}
      scale={scale}
      onClick={() => {
        setSelectedModel(meshRef.current, url);
        setSelectedModelUrl(url);
        onSelect();
      }}
    >
      <meshPhongMaterial color={"gray"} />
    </mesh>
  );
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
    console.error("Hiba történt a felhasználói azonosító lekérésekor:", error);
    return null; // vagy dobhat egy hibát, attól függően, hogy szeretné kezelni a hibákat
  }
};

const RoomPlanner = () => {
  const [stlFiles, setStlFiles] = useState<STLFile[]>([]);
  const [stlUrls, setStlUrls] = useState<string[]>([]);
  const [selectedStlIndex, setSelectedStlIndex] = useState<number | null>(null);
  const router = useRouter();
  const [blueprintData, setBlueprintData] = useState<FloorProps | null>(null);
  const { selectedModel, setSelectedModel, setSelectedModelUrl } = useStore();

  const [selectedStlUrl, setSelectedStlUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [showNotification, setShowNotification] = useState(false);

  const [transformMode, setTransformMode] = useState<
    "scale" | "rotate" | "translate"
  >("translate");

  const selectStl = (index: number) => {
    setSelectedStlIndex(index);

    console.log("test : " + index);
  };

  function addStl(url: string) {
    setStlUrls((prevUrls) => [...prevUrls, url]);
  }

  const handleRemoveSelectedModel = () => {
    if (selectedStlIndex !== null) {
      // Kiszűri a kiválasztott indexű elemet
      const updatedStlUrls = stlUrls.filter(
        (_, index) => index !== selectedStlIndex
      );

      // Frissíti a stlUrls állapotot
      setStlUrls(updatedStlUrls);

      setSelectedModelUrl("");
      setSelectedStlIndex(null);
    }
  };

  // const deleteSelectedStl = () => {
  //  if (selectedStlIndex !== null) {
  //  setStlModels((prevModels) => {
  //   return prevModels.filter((_, idx) => idx !== selectedStlIndex);
  // });
  // setSelectedStlIndex(null);
  // }
  //};

  const fetchStlFiles = async () => {
    const email = localStorage.getItem("userEmail") || "ERROR";
    const userId = await getUserIdByEmail(email);
    const response = await fetch(`/api/STL/files?userId=${userId}`);
    if (response.ok) {
      const files = await response.json();
      setStlFiles(files);
    } else {
      console.error("Nem sikerült betölteni a fájlokat");
    }
  };

  const UploadNotification = () => {
    if (!showNotification) return null;

    return (
      <div className="flex flex-col items-center justify-center">
        <h3 className="my-4">Fájl sikeresen feltöltve</h3>
        <button
          onClick={() => {
            setShowNotification(false);
            if (formRef.current) formRef.current.reset(); // űrlap kiürítése
          }}
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            OK
          </span>
        </button>
      </div>
    );
  };

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fileInput = event.currentTarget.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    if (!file) {
      console.error("Nincs fájl kiválasztva.");
      return;
    }

    // A fájl hozzáadása a formData-hoz
    formData.append("file", file);

    // Email cím lekérdezése
    const email = localStorage.getItem("userEmail") || "ERROR";
    try {
      const userId = await getUserIdByEmail(email);
      formData.append("userId", userId);

      // Feltöltési kérés elküldése

      const response = await fetch("/api/STL/add", {
        method: "POST",
        body: formData,
      });
      console.log(response);
      if (response.ok) {
        console.log("Fájl feltöltve:", await response.json());
        await fetchStlFiles();
        setShowNotification(true);
      } else {
        throw new Error("Hiba történt a fájl feltöltésekor.");
      }
    } catch (error) {
      console.error("Hiba:", error);
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      const email = localStorage.getItem("userEmail") || "ERROR";
      const userId = await getUserIdByEmail(email);
      const response = await fetch(`/api/STL/files?userId=${userId}`);
      if (response.ok) {
        const files = await response.json();
        setStlFiles(files);
      } else {
        // Hiba kezelése
        console.error("Nem sikerült betölteni a fájlokat");
      }
    };

    fetchFiles();

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


  
  const saveProject = async () => {
    const userId = await getUserIdByEmail(localStorage.getItem("userEmail") || "ERROR");
    // Itt gyűjtse össze a mentendő adatokat
    const projectData = {
      userId : userId,
      name : "projectDefault",
      data : {
      stlFiles,
      stlUrls,
      blueprintData,
      }
      // További adatok hozzáadása, ha szükséges
    };
  
    try {
      const response = await fetch('/api/roomPlanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
  
      if (response.ok) {
        // Sikeres mentés kezelése
        console.log("Projekt sikeresen elmentve");
      } else {
        // Hiba kezelése
        console.error("Hiba történt a projekt mentésekor");
      }
    } catch (error) {
      console.error("Hiba történt a kérés küldésekor:", error);
    }
  };
  
  
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

            {blueprintData && <Floor {...blueprintData} />}

            {stlUrls.map((url, index) => (
              <STLModel
                key={index}
                url={url}
                position={[0, 0, 0]}
                scale={[1, 1, 1]}
                onSelect={() => selectStl(index)} // STL modell kiválasztásának hívása a selectStl funkcióval
              />
            ))}
            {selectedModel && (
              <TransformControls object={selectedModel} mode={transformMode} />
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
          <div className="m-2">
            <div className=" my-4 block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              {showNotification ? (
                <UploadNotification />
              ) : (
                <form ref={formRef} onSubmit={handleFileUpload}>
                  <div className="mb-3">
                    <label
                      htmlFor="file"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Válassza ki a fájlt
                    </label>
                    <input
                      type="file"
                      id="file"
                      name="file"
                      accept=".stl"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                    />
                  </div>

                  <div className="mb-3 flex">
                    <label htmlFor="public" className="flex items-center">
                      <input
                        type="checkbox"
                        id="public"
                        name="public"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Publikus
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded m-auto"
                  >
                    Feltöltés
                  </button>
                </form>
              )}
            </div>
            <div className="flex justify-center items-center space-x-2 my-4">
              <button
                onClick={() => setTransformMode("translate")}
                className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded shadow-md hover:shadow-lg"
              >
                Mozgatás
              </button>
              <button
                onClick={() => setTransformMode("rotate")}
                className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded shadow-md hover:shadow-lg"
              >
                Forgatás
              </button>
              <button
                onClick={() => setTransformMode("scale")}
                className="bg-slate-500 hover:bg-slate-700 text-white p-4 rounded shadow-md hover:shadow-lg"
              >
                Álméretezés
              </button>
            </div>

            <button
              onClick={handleRemoveSelectedModel}
              className="your-button-styles"
            >
              Modell Törlése
            </button>
            <div className="mb-4">
              <label className="block mb-2 text-white">Add STL To room:</label>
              <div>
                {stlFiles.map((file, index) => (
                  <button
                    key={index}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 m-1 rounded"
                    onClick={() => addStl(file.fileRoot + file.filename)}
                  >
                    {file.filename}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={saveProject}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
              >
                Projekt Mentése
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};
export default RoomPlanner;
