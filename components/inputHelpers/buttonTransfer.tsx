import { useState, useEffect } from 'react';

function ButtonTransfer() {
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const handleRedirect = () => {
    setShouldNavigate(true);
  }

  useEffect(() => {
    if (shouldNavigate) {
      window.location.href = "/creativePage";
    }
  }, [shouldNavigate]);

  return (
    <div>
      {/* További komponens tartalom... */}
      
      <button 
      className="bg-slate-500 hover:bg-slate-700 text-white p-2 rounded-md m-2"
      onClick={handleRedirect}>
        Tovább a CreativePage-re
      </button>
    </div>
  );
}

export default ButtonTransfer;
