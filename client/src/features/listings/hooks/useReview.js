import reviewApi from "../services/review.api";

const useReview = () => {

    const handleCreateReview = async (review, listingId) => {
        try {
            const data = await reviewApi.createReview(review, listingId);

            return { success: true, message: data.message, review: data.review };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message ||
                    error.message ||
                    "Error in creating review"
            }
        }
    }

    const handleEditReview = async (review, listingId, reviewId) => {
        try {
            const data = await reviewApi.editReview(review, listingId, reviewId);

            return { success: true, message: data.message, review: data.review };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message ||
                    error.message ||
                    "Error in editing review"
            }
        }
    }

    const handleDeleteReview = async (listingId, reviewId) => {
        try {
            const data = await reviewApi.deleteReview(listingId, reviewId);

            return { success: true, message: data.message, review: data.review };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message ||
                    error.message ||
                    "Error in deleting review"
            }
        }
    }

    return { handleCreateReview, handleEditReview, handleDeleteReview };
}

export default useReview;