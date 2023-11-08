import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import "../styles/style.css";
import ProtectedRoute from "./protectedRouteProps";
import LogOut from "@/components/inputHelpers/logout";
import { OrbitControls } from "@react-three/drei";
import STLModel from "@/components/inputHelpers/stlMModel";

export default function RoomPlanner() {
  const router = useRouter();
  const [boxes, setBoxes] = useState([]);
  const [furniture, setFurniture] = useState([]);
  const [blueprint, setBlueprint] = useState(null);

  useEffect(() => {
    // A router.query aszinkron viselkedése miatt ellenőrizzük, hogy a blueprintId már rendelkezésre áll-e
    const blueprintId = router.query.blueprintId as string | undefined;
    if (blueprintId) {
      loadBlueprint(blueprintId);
    }
  }, [router.isReady, router.query.blueprintId]); // Figyeljük a router.isReady-t is

  const loadBlueprint = async (id: string) => {
    try {
      const response = await fetch(`/api/bluePrints?id=${id}`);
      const blueprintData = await response.json();
      if (response.ok) {
        setBlueprint(blueprintData);
        console.log("Alaprajz betöltve:", blueprintData);
      } else {
        throw new Error(
          blueprintData.message || "Nem sikerült betölteni az alaprajzot."
        );
      }
    } catch (error) {
      console.error("Hiba történt az alaprajz betöltésekor:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="grid grid-cols-3 gap-4 h-full">
        {/* 3D Tér */}
        <div className="col-span-2">
          {/* TODO: Itt jelenik meg a 3D tér az összes box-szal és berendezéssel. */}
          {/* TODO: 3D renderelés és STL fájlok megjelenítése. */}
        </div>

        {/* Oldalsó Panel */}
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

          {/* STL Fájlok Feltöltése */}
          <div className="mb-4">
            <label className="block mb-2 text-white">Upload STL:</label>
            <input type="file" className="p-2 bg-gray-700 text-white rounded" />
            {/* TODO: STL fájlok feltöltése és tárolása. */}
          </div>

          {/* Berendezések Elhelyezése */}
          <div className="mb-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
              Place Furniture
            </button>
            {/* TODO: Drag-and-drop funkció vagy kiválasztó eszköz a berendezések elhelyezéséhez. */}
          </div>

          {/* Mentés és Exportálás */}
          <div className="flex justify-between">
            <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded">
              Save Layout
            </button>
            {/* TODO: Jelenlegi elrendezés mentése. */}

            <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded">
              Export as STL
            </button>
            {/* TODO: Elrendezés exportálása STL formátumban. */}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
