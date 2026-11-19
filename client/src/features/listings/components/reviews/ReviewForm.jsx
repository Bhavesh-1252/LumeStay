import { FaStar } from "react-icons/fa";

const ReviewForm = ({ rating, hovered, setRating, setHovered, comment, setComment, commentError, label }) => {

    const active = hovered || rating;

    return (
        <>
            {label?.review && <p className="mb-1.5 text-sm font-medium text-gray-900">{label.review}</p>}
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, idx) => (
                    <button
                        onMouseEnter={() => setHovered(idx + 1)}
                        onMouseLeave={() => setHovered(rating)}
                        onClick={() => setRating(idx + 1)}
                        name="rating"
                        key={idx + 1}
                        type="button"
                        className="cursor-pointer p-0.5">

                        <FaStar
                            className={`h-6 w-6 transition-colors hover:text-rose-600 ${idx + 1 <= active ? "text-rose-600" : "text-gray-300"}`} />

                    </button>)
                )}
            </div>

            <div>
                {
                    label?.comment && <label htmlFor="comment" className="mb-1.5 block text-sm font-medium text-gray-900">
                    {label.comment}
                </label>
                }
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Share what you liked about your stay"
                    className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />

            </div>
            {commentError && <p className="text-sm font-medium text-red-600">{commentError}</p>}
        </>
    )
}

export default ReviewForm;