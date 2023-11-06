import React, { useEffect, useState } from "react";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      window.location.href = "/";
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div>
        <h1>Jelentkez be hogy tudd használni az oldat !</h1>
        <button onClick={() => window.location.href = "/"}>Vissza a kezdő oldalra</button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
