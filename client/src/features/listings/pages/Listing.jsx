import { useParams } from "react-router";
import ListingDetails from "../components/listings/ListingDetails";
import { useEffect, useState } from "react";
import useListings from "../hooks/useListings";
import { BiLoader } from "react-icons/bi";

const Listing = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [listing, setListing] = useState(null);

    const { id } = useParams();
    const { handleGetOneListing } = useListings();

    const fetchOneListing = async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await handleGetOneListing(id);
            if (!response.success) setError(response);

            setListing(response.listing);
        } catch (error) {
            setError(error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const initialRender = () => { fetchOneListing(); }
        initialRender();
    }, []);

    if (error) throw error;

    return (
        <div className="flex flex-1 flex-col">
            {
                loading ?
                    <div className="flex flex-1 items-center justify-center">
                        <BiLoader className="w-10 h-10 animate-spin" />
                    </div>
                    :
                    <> {listing && <ListingDetails listing={listing} />}</>
            }
        </div>)
}

export default Listing;