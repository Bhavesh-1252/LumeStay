import { Link } from "react-router";

const ListingCard = ({ listing }) => {
  return (
    <Link
      to={`/listings/${listing._id}`}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-4"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
        {listing.image ?
          <img src={listing.image?.path}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover" />
          : <span
            className="h-full flex justify-center items-center text-gray-500">No image</span>}
      </div>

      <div className="mt-2">
        <h3 className="truncate font-semibold text-gray-900">{/* title */}
          {listing.title}
        </h3>
        <p className="text-gray-600 text-sm">
          &#8377;{listing.price.toLocaleString("en-IN")} for 1 night
          <span className="ml-1 italic">{/* + 18% GST (conditional) */}</span>
        </p>
      </div>
    </Link>
  );
}

export default ListingCard;