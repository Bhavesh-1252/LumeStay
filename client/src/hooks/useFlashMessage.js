import { useContext } from "react";
import FlashMessageContext from "../context/FlashMessage.context";

const useFlashMessage = () => {
    const context = useContext(FlashMessageContext);

    if (!context) {
        throw new Error("useFlashMessage must be used within FlashMessageProvider");
    }

    return context;
}

export default useFlashMessage;