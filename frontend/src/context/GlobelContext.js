import { createContext, useEffect, useState } from "react";
export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [pageLevelLoader, setPageLevelLoader] = useState(false);
  const [isAuthUser, setIsAuthUser] = useState({});

  return (
    <GlobalContext.Provider
      value={{
        pageLevelLoader,
        setPageLevelLoader,
        isAuthUser,
        setIsAuthUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
