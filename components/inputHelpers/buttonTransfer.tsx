import { useState, useEffect } from "react";

type ButtonTransferProps = {
  token?: string | undefined | null;
  onRedirect: () => void;
};

function ButtonTransfer({ token, onRedirect }: ButtonTransferProps) {
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const handleRedirect = () => {
    setShouldNavigate(true);
  };

  useEffect(() => {
    if (shouldNavigate) {
      if (token) {
        localStorage.setItem("token", token);
      }
      onRedirect();
      window.location.href = "/bluePrint";
    }
  }, [shouldNavigate, token, onRedirect]);
  return (
    <div>

      <button
        className="bg-slate-500 hover:bg-slate-700 text-white p-2 rounded-md m-2"
        onClick={handleRedirect}
      >
        Tovább a CreativePage-re
      </button>
    </div>
  );
}

export default ButtonTransfer;
