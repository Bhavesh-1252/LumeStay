import { useState } from "react";
import useFlashMessage from "../../../../hooks/useFlashMessage";
import ReviewForm from "./ReviewForm";

const CreateReview = ({ onReviewCreate }) => {
    const [hovered, setHovered] = useState(0);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState("");

    const { showFlash } = useFlashMessage();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!comment.trim()) {
            setCommentError("Comment is required");
            return;
        }
        else if (comment.trim().length > 200) {
            setCommentError("Comment cannot exceed 200 characters");
            return;
        }
        
        if (commentError) setCommentError("");
        setLoading(true);
        try {
            const result = await onReviewCreate({ rating, comment });
            if (!result.success) {
                showFlash(result.message, "error");
                return;
            }

            setComment("");
            setRating(1);
            showFlash(result.message, "success");
        } catch (error) {
            showFlash(error.message, "error");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <section className="mt-12 border-t border-gray-200 pt-10">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Leave a review</h2>

            <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
                <ReviewForm
                    rating={rating}
                    hovered={hovered}
                    setRating={setRating}
                    setHovered={setHovered}
                    comment={comment}
                    setComment={setComment}
                    commentError={commentError}
                    label={{ review: "Review", comment: "Comment" }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Submitting..." : "Submit review"}
                </button>
            </form>
        </section>
    );
}

export default CreateReview;