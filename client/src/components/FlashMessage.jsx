import { FaCircleInfo } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";
import { MdError } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

const styles = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
};

const icons = {
    success: <FaCheckCircle />,
    error: <MdError />,
    warning: <IoWarning />,
    info: <FaCircleInfo />,
};

const FlashMessage = ({ message, type = "info" }) => {
    if (!message) return null;

    const style = styles[type] || styles.info;

    return (
        <div
            role={type === "error" ? "alert" : "status"}
            className={`flex items-center gap-3 rounded-lg border mt-2 px-4 py-3 text-sm font-medium ${style}`}
        >
            <span className="text-lg" aria-hidden="true">
                {icons[type] || icons.info}
            </span>

            <p>{message}</p>
        </div>
    );
};

export default FlashMessage;
