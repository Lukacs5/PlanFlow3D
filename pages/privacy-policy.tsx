import "../styles/globals.css";
import "../styles/style.css";
import Head from "next/head";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="dark:bg-black bg-slate-400 min-h-screen p-8">
      <nav className="m-2 bg-slate-600 rounded-xl flex justify-between items-center ">
        <h1
          onClick={() => location.reload()}
          className="m-2 text-5xl text-left text-white font-bold"
        >
          PlanFlow3D
        </h1>
      </nav>

      <Head>
        <title>Adatvédelmi Nyilatkozat</title>
      </Head>
      <main className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md m-2" >
        <h1 className="text-3xl font-semibold mb-4">Adatvédelmi Nyilatkozat</h1>
        <p>
          A{" "}
          <Link className="text-blue-500" href="/">
            PlanFLow3D
          </Link>{" "}
          elkötelezett a látogatói személyes adatainak védelme iránt. Ez az
          Adatvédelmi Nyilatkozat tájékoztat adatainak kezeléséről.
        </p>
        <h2 className="text-xl font-semibold mt-6">
          Személyes adatok gyűjtése
        </h2>
        <p>
          Látogatóinknak nem szükséges személyes adataikat megadniuk ahhoz, hogy
          weboldalunk tartalmához hozzáférjenek. Azonban bizonyos szolgáltatások
          használata során szükségessé válhat a személyes adatok megadása.
        </p>
        <h2 className="text-xl font-semibold mt-6">
          Hogyan használjuk fel a gyűjtött információkat?
        </h2>
        <p>
          A gyűjtött adatokat kizárólag a megadott célra használjuk fel, és nem
          osztjuk meg harmadik féllel kereskedelmi célokra.
        </p>
        <h2 className="text-xl font-semibold mt-6">Sütik (Cookies)</h2>
        <p>
          Weboldalunk sütiket használ a felhasználói élmény javítása érdekében.
          A sütik kis fájlok, amelyek a böngésződ segítségével kerülnek
          tárolásra az eszközödön. Ezen fájlok információkat gyűjtenek a
          látogatásaidról, de nem tárolnak személyes adatokat.
        </p>
        <h2 className="text-xl font-semibold mt-6">Harmadik fél</h2>
        <p>
          Weboldalunkon található hivatkozások más oldalakra is vezethetnek.
          Amennyiben ezekre az oldalakra kattintasz, elhagyod az oldalunkat, és
          ajánlott elolvasni az adott oldal adatvédelmi nyilatkozatát.
        </p>
        <h2 className="text-xl font-semibold mt-6">Adatvédelem</h2>
        <p>
          Nagy gondot fordítunk az Ön személyes adatainak védelmére. Az
          információkat biztonságos környezetben tároljuk, és azokhoz csak
          korlátozott számú személy férhet hozzá.
        </p>
        <Link className="text-blue-500" href="/">
          Vissza a fő oldalra
        </Link>{" "}
      </main>
    </div>
  );
};

export default PrivacyPolicy;
