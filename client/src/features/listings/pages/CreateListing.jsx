import CreateListingForm from "../components/listings/ListingForm";
import { useNavigate } from "react-router";
import useFlashMessage from "../../../hooks/useFlashMessage";
import useListings from "../hooks/useListings";

const CreateListing = () => {
    const data = {
        title: "",
        description: "",
        price: "",
        location: "",
        country: "",
    };

    const { handleCreateListing } = useListings();
    const { showFlash } = useFlashMessage();
    const navigate = useNavigate();

    const onSubmitData = async (finalData) => {
        const response = await handleCreateListing(finalData);
        if (response.success) {
            showFlash(response.message, "success");
            navigate(`/listings/${response.listingId}`);
        }
        return response;
    }

    return (
    <CreateListingForm label={"Create Listing"} initialData={data} onSubmitData={onSubmitData} />
    )
}

export default CreateListing;