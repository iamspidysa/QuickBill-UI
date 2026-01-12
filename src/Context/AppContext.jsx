import { createContext, useEffect, useState } from "react";
import { fetchCategory } from "../Service/CategoryService";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext(null);

export const AppContextProvider = (props) => {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadData() {
      // Load data logic here
      const response = await fetchCategory();
      setCategories(response.data);
    }

    loadData();
  }, []);

  const contextValue = {
    // Add any global state or functions you want to provide here
    categories,
    setCategories
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
