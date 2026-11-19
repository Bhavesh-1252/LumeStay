import client from "../../../services/axios";

const createReview = async (review, listingId) => {
    const response = await client.post(`/api/listings/${listingId}/reviews`, review);
    return response.data;
}

const editReview = async (review, listingId, reviewId) => {
    const response = await client.put(`/api/listings/${listingId}/reviews/${reviewId}`, review);
    return response.data;
}

const deleteReview = async (listingId, reviewId) => {
    const response = await client.delete(`/api/listings/${listingId}/reviews/${reviewId}`);
    return response.data;
}

const reviewApi = {
    createReview,
    editReview,
    deleteReview,
}

export default reviewApi;