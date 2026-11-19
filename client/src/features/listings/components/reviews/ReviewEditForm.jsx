import { useState } from "react";
import useFlashMessage from "../../../../hooks/useFlashMessage";
import ReviewForm from "./ReviewForm";

const ReviewEditForm = ({ review, onReviewEdit, setShowEditForm }) => {
    const [hovered, setHovered] = useState(0);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(review.rating);
    const [comment, setComment] = useState(review.comment);
    const [commentError, setCommentError] = useState("");

    const { showFlash } = useFlashMessage();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (commentError) setCommentError("");

        if (!comment.trim()) {
            setCommentError("Comment is required");
            return;
        }
        else if (comment.trim().length > 150) {
            setCommentError("Comment cannot exceed 150 characters");
            return;
        }

        setLoading(true);
        try {
            const result = await onReviewEdit({ rating, comment }, review._id);
            showFlash(result.message, result.success ? "success" : "error");

        } catch (error) {
            showFlash(error.message);
        }
        finally {
            setLoading(false);
            setComment("");
            setRating(1);
            setShowEditForm(false);
        }
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <p className="font-semibold text-gray-900">{review.author.username}</p>

            {/* the same star picker you already built */}
            <ReviewForm
                rating={rating}
                hovered={hovered}
                setRating={setRating}
                setHovered={setHovered}
                comment={comment}
                setComment={setComment}
                commentError={commentError}
            />


            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="cursor-pointer rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="cursor-pointer rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    )
}

export default ReviewEditForm;