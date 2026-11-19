import listingsApi from "../services/listing.api";

const useListings = () => {

    const handleGetAllListings = async () => {
        try {
            const data = await listingsApi.getAllListings();
            return { success: true, message: data.message, listings: data.listings };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message ||
                    error.message ||
                    "Error in fetching all listings"
            }
        }
    }

    const handleGetOneListing = async (id) => {
        try {
            const data = await listingsApi.getOneListing(id);
            return { success: true, message: data.message, listing: data.listing };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message ||
                    error.message ||
                    "Error in fetching listing"
            }
        }
    }

    const handleCreateListing = async (formData) => {
        try {
            const data = await listingsApi.createListing(formData);

            return { success: true, message: data.message, listingId: data.listingId };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message ||
                    error.message ||
                    "Error in creating listing"
            }
        }
    }


    const handleEditListing = async (formData, id) => {
        try {
            const data = await listingsApi.editListing(formData, id);

            return { success: true, message: data.message, listingId: data.listingId };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message ||
                    error.message ||
                    "Error in editing listing"
            }
        }
    }

    const handleDestroyListing = async (id) => {
        try {
            const data = await listingsApi.destroyListing(id);

            return { success: true, message: data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message ||
                    error.message ||
                    "Error in deleting listing"
            }
        }
    }

    return { handleGetAllListings, handleGetOneListing, handleCreateListing, handleEditListing, handleDestroyListing };

}

export default useListings;