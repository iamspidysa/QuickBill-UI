import { createContext, useEffect, useState } from "react";
import { fetchCategory } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext(null);

export const AppContextProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    return {
      token: token || null,
      role: role || null,
    };
  });
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {

    // Use itemId to identify products because different products can have the same name.
    // This keeps add, remove, and quantity updates consistent.
    const existingItem = cartItems.find(
      (cartItem) => cartItem.itemId === item.itemId,
    );
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.itemId === item.itemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        ),
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const setAuthData = (token, role) => {
    setAuth({ token, role });
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item.itemId !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.itemId === itemId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Fetch categories and items when the user is logged in.
  // The auth token is already loaded from localStorage.
  useEffect(() => {
    if (!auth?.token) return;

    async function loadData() {
      const response = await fetchCategory();
      const itemResponse = await fetchItems();

      setCategories(response.data);
      setItemsData(itemResponse.data);
    }

    loadData();
  }, [auth.token]);

  const contextValue = {
    // Add any global state or functions you want to provide here
    categories,
    setCategories,
    auth,
    setAuthData,
    itemsData,
    setItemsData,
    addToCart,
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
