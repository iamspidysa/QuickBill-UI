import { createContext, useEffect, useState } from "react";
import { fetchCategory } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext(null);

export const AppContextProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [auth, setAuth] = useState({
    token: null,
    role: null,
  });

  const setAuthData = (token, role) => {
    setAuth({ token, role });
  };

  useEffect(() => {
    async function loadData() {
      /* This code checks if a JWT token and role exist in localStorage when the app starts.
      If they do, it restores them into React state so the user stays logged in after a page refresh.

      Without it, refreshing the page would reset auth state and log the user out.
      It does not validate the token—backend security still handles that.*/
      if (localStorage.getItem("token") && localStorage.getItem("role")) {
        setAuthData(
          localStorage.getItem("token"),
          localStorage.getItem("role"),
        );
      }
      // Load data logic here
      const response = await fetchCategory();
      const itemResponse = await fetchItems();
      setCategories(response.data);
      setItemsData(itemResponse.data);
    }

    loadData();
  }, []);

  const contextValue = {
    // Add any global state or functions you want to provide here
    categories,
    setCategories,
    auth,
    setAuthData,
    itemsData,
    setItemsData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
