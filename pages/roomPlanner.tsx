import React, { useState } from "react";
import "../styles/globals.css";
import "../styles/style.css";
// További importok szükségesek lehetnek a 3D funkciókhoz és az STL kezeléséhez.

export default function RoomPlanner(props : any) {
  // Állapotok (state) a boxok, STL fájlok és berendezések tárolásához.
  const [boxes, setBoxes] = useState([]); // Az előző oldalról betöltött boxok.
  const [furniture, setFurniture] = useState([]); // A felhasználó által hozzáadott berendezések.

  return (
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
          {/* TODO: További navigációs elemek hozzáadása, ha szükséges. */}
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
  );
}
