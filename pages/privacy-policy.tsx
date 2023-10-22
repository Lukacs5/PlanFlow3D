import Head from 'next/head'

export default function PrivacyPolicy() {
  return (
    <div>
      <Head>
        <title>Adatvédelmi Nyilatkozat</title>
      </Head>
      <main>
        <h1>Adatvédelmi Nyilatkozat</h1>
        <p>
          A <a href="http://localhost:3000">PlanFLow3D</a> elkötelezett a látogatói személyes adatainak védelme iránt. 
          Ez az Adatvédelmi Nyilatkozat tájékoztat adatainak kezeléséről.
        </p>
        <h2>Személyes adatok gyűjtése</h2>
        <p>
          Látogatóinknak nem szükséges személyes adataikat megadniuk ahhoz, hogy weboldalunk tartalmához hozzáférjenek. Azonban bizonyos 
          szolgáltatások használata során szükségessé válhat a személyes adatok megadása.
        </p>
        <h2>Hogyan használjuk fel a gyűjtött információkat?</h2>
        <p>
          A gyűjtött adatokat kizárólag a megadott célra használjuk fel, és nem osztjuk meg harmadik féllel kereskedelmi célokra.
        </p>
        <h2>Sütik (Cookies)</h2>
        <p>
          Weboldalunk sütiket használ a felhasználói élmény javítása érdekében. A sütik kis fájlok, amelyek a böngésződ segítségével 
          kerülnek tárolásra az eszközödön. Ezen fájlok információkat gyűjtenek a látogatásaidról, de nem tárolnak személyes adatokat.
        </p>
        <h2>Harmadik fél</h2>
        <p>
          Weboldalunkon található hivatkozások más oldalakra is vezethetnek. Amennyiben ezekre az oldalakra kattintasz, elhagyod az oldalunkat, 
          és ajánlott elolvasni az adott oldal adatvédelmi nyilatkozatát.
        </p>
        <h2>Adatvédelem</h2>
        <p>
          Nagy gondot fordítunk az Ön személyes adatainak védelmére. Az információkat biztonságos környezetben tároljuk, és azokhoz csak korlátozott 
          számú személy férhet hozzá.
        </p>
      </main>
    </div>
  )
}
