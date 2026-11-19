import client from "../../../services/axios";

const getAllListings = async () => {
    const response = await client.get("/api/listings/");
    return response.data;
}

const getOneListing = async (id) => {
    const response = await client.get(`/api/listings/${id}`);
    return response.data;
}

const createListing = async (formData) => {
    const response = await client.post(`/api/listings/`, formData);
    return response.data;
}

const editListing = async (formData, id) => {
    const response = await client.put(`/api/listings/${id}`, formData);
    return response.data;
}

const destroyListing = async(id) => {
    const response = await client.delete(`/api/listings/${id}`);
    return response.data;
}

const listingsApi = {
    getAllListings,
    getOneListing,
    createListing,
    editListing,
    destroyListing,
}

export default listingsApi;