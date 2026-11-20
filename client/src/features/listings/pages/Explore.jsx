import { useEffect, useState } from "react";
import useListings from "../hooks/useListings";
import { BiLoader } from "react-icons/bi";
import ListingsContainer from "../components/listings/ListingsContainer"

const Explore = () => {
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);

  const { handleGetAllListings } = useListings();

  const fetchAllListings = async () => {
    setLoading(true);
    try {
      const response = await handleGetAllListings();

      setListings(response.listings);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initialRender = () => { fetchAllListings(); }
    initialRender();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      {loading ?
        <div className="flex flex-1 items-center justify-center">
          <BiLoader className="w-10 h-10 animate-spin" />
        </div>
        :
        <>  {error || !listings.length ?
          <div className="flex flex-1 items-center justify-center px-6">
            <p className="text-center text-gray-500">
              {error ? error : "No listings are available"}
            </p>
          </div>
          : <ListingsContainer listings={listings} />}
        </>}
    </div>

  );
};

export default Explore;
