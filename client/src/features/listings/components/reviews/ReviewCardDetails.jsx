import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { useAuth } from "../../../auth/hooks/useAuth";

const ReviewCardDetails = ({ review, setShowEditForm, onDeleteReview }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const {user} = useAuth();

    useEffect(() => {
        if (!showDropdown) return;

        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
        }
        document.addEventListener("mousedown", handleClick)

        return () => document.removeEventListener("mousedown", handleClick);
    }, [showDropdown])

    return (
        <>
            <div className="flex items-start justify-between gap-3">
                <p className="truncate font-semibold text-gray-900">@{review.author.username}</p>

               { user?.id === review?.author?._id && <div ref={dropdownRef} className="relative shrink-0">
                    <button
                        type="button"
                        onClick={() => setShowDropdown(prev => !prev)}
                        className="cursor-pointer rounded-full p-1.5 text-gray-600 hover:bg-gray-100"
                    >
                        <BsThreeDotsVertical className="h-4 w-4" />
                    </button>

                    {
                        showDropdown && <div className="absolute right-0 top-full z-10 mt-1 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                            <button
                                type="button"
                                onClick={() => setShowEditForm(true)}
                                className="cursor-pointer block w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={onDeleteReview}
                                className="cursor-pointer block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                            >
                                Delete
                            </button>
                        </div>
                    }
                </div>}
            </div>

            {/* Stars: render 5 of these */}
            <div className="mt-1.5 flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, idx) => <FaStar
                    key={idx + 1}
                    className={`h-4 w-4 ${idx + 1 <= review.rating ? "text-rose-500" : "text-gray-300"}`} />
                )}
            </div>

            <p className="mt-3 leading-relaxed text-gray-700">{review.comment}</p>
        </>
    )
}

export default ReviewCardDetails;