import { useEffect, useState } from "react";
import CreateListingForm from "../components/listings/ListingForm";
import useListings from "../hooks/useListings";
import { useNavigate, useParams } from "react-router";
import useFlashMessage from "../../../hooks/useFlashMessage";
import { BiLoader } from "react-icons/bi";

const EditListing = () => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { id } = useParams();
    const { handleGetOneListing, handleEditListing } = useListings();
    const { showFlash } = useFlashMessage();
    const navigate = useNavigate();

    const onSubmitData = async (finalData) => {
        const response = await handleEditListing(finalData, id);
        if (response.success) {
            showFlash(response.message, "success");
            navigate(`/listings/${response.listingId}`);
        }
        return response;
    }

    const fetchOneListing = async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await handleGetOneListing(id);
            if (!response.success) {
                setError(response.error);
                return;
            }

            const data = {
                title: response.listing.title,
                description: response.listing.description,
                price: response.listing.price,
                location: response.listing.location,
                country: response.listing.country,
            }
            if (response.listing?.image?.path) data.image = response.listing.image.path;

            setFormData(data);

        } catch (error) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const initialRender = () => { fetchOneListing(); }
        initialRender();
    }, []);

    if(error) throw error;

    return (
        <div className="flex flex-1 flex-col">
            {
                loading ?
                    <div className="flex flex-1 items-center justify-center">
                        <BiLoader className="w-10 h-10 animate-spin" />
                    </div>
                    :
                    <>
                        {
                            formData &&
                            <CreateListingForm
                                subHeading={"Change the details your guests will see."}
                                heading={"Update your stay details"}
                                label={"Save Changes"}
                                onSubmitData={onSubmitData}
                                initialData={formData} />
                        }
                    </>
            }
        </div>
    )
}

export default EditListing;