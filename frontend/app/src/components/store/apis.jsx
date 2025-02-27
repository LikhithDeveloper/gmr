import { createContext, useState, useEffect } from "react";

export const contextApi = createContext();

export const Apis = ({ children }) => {
  const [liveuser, setLiveUser] = useState(null);

  const fetchProtectedData = async () => {
    console.log("Hi");
    try {
      const response = await fetch("http://localhost:3000/protected", {
        method: "GET",
        credentials: "include", // Include cookies in the request
      });

      const data = await response.json();
      if (data.user) {
        setLiveUser(data.user);
      } else {
        setLiveUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProtectedData();
  }, []);

  return (
    <contextApi.Provider value={{ liveuser, setLiveUser, fetchProtectedData }}>
      {children}
    </contextApi.Provider>
  );
};
