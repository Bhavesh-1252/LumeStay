import { useEffect, useRef, useState } from "react";
import FlashMessageContext from "../context/FlashMessage.context";
import FlashMessage from "../components/FlashMessage";

const FlashMessageProvider = ({ children }) => {
  const [flash, setFlash] = useState(null);
  const timeoutRef = useRef(null);

  const showFlash = (message, type = "info") => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);

    setFlash({ message, type });

    timeoutRef.current = setTimeout(() => {
      setFlash(null);
      timeoutRef.current = null;
    }, 3000);
  };

  const clearFlash = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setFlash(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <FlashMessageContext.Provider value={{ showFlash, clearFlash }}>
      {children}
      {flash && (
        <div className="fixed right-5 top-5 z-50 w-[calc(100%-2.5rem)] max-w-md">
          <FlashMessage message={flash.message} type={flash.type} />
        </div>
      )}
    </FlashMessageContext.Provider>
  );
};

export default FlashMessageProvider;
