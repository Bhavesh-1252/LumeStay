import { useNavigate } from "react-router";
import Map from "../Map";
import ReviewCard from "../reviews/ReviewCard"
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";
import useListings from "../../hooks/useListings";
import useFlashMessage from "../../../../hooks/useFlashMessage";
import { useAuth } from "../../../auth/hooks/useAuth";
import CreateReview from "../reviews/CreateReview";
import useReview from "../../hooks/useReview";

const ListingDetails = ({ listing }) => {
    const [deleting, setDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showLeaveReview, setShowLeaveReview] = useState(false);
    const [reviews, setReviews] = useState(listing.reviews);

    const price = listing.price;
    const gst = price * 0.18;
    const totalPrice = price + gst;

    const navigate = useNavigate();
    const { showFlash } = useFlashMessage();
    const { handleDestroyListing } = useListings();
    const { handleCreateReview, handleEditReview } = useReview();
    const { user } = useAuth();

    const deleteThisListing = async () => {
        setDeleting(true);

        try {
            const response = await handleDestroyListing(listing._id);
            if (!response.success) {
                showFlash(response.message, "error");
                return;
            }

            showFlash(response.message, "success");
            navigate("/");
        } catch (error) {
            showFlash(error.message, "error");
        } finally {
            setShowModal(false);
            setDeleting(false);
        }
    }

    const handleLeaveReview = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setShowLeaveReview(true);
    }

    const onReviewCreate = async (reviewData) => {
        const response = await handleCreateReview(reviewData, listing._id);
        if (response.success) {
            setReviews((prev) => [...prev, response.review]);
        }

        return response;
    }

    const onReviewEdit = async (review, reviewId) => {
        const response = await handleEditReview(review, listing._id, reviewId);
        if (response.success) {
            setReviews((prev) => {
                return prev.map((r) => {
                    if (r._id === reviewId) {
                        r.comment = response.review.comment;
                        r.rating = response.review.rating;
                    }
                    return r;
                })
            })
        }

        return response;
    }


    return (
        <div className="mx-auto w-full max-w-screen-xl px-6 py-8 lg:px-28">
            {showModal && <ConfirmModal
                showModal={showModal}
                onCancel={() => setShowModal(false)}
                deleting={deleting}
                onDelete={() => deleteThisListing()}
            />}
            {/* Title + location */}
            {/* <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">{listing.title}</h1>
                    <p className="mt-1 text-gray-600">{listing.location}, {listing.country}</p>
                </div>
                <div className="flex">
                    <button className="mt-4 w-full rounded-xl bg-rose-500 py-3 font-semibold text-white hover:bg-rose-600">Edit Listing</button>
                    <button className="mt-4 w-full rounded-xl bg-rose-500 py-3 font-semibold text-white hover:bg-rose-600">Delete</button>
                </div>
            </header> */}

            <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">{listing.title}</h1>
                    <p className="mt-1 text-gray-600">{listing.location}, {listing.country}</p>
                </div>

                {
                    listing.owner.username === user?.username &&
                    <div className="flex shrink-0 items-center gap-3">
                        <button
                            type="button"
                            className="rounded-xl border cursor-pointer border-gray-300 px-5 py-2.5 font-medium text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                            onClick={() => navigate(`/listings/${listing._id}/edit`)}
                        >
                            Edit listing
                        </button>
                        <button
                            type="button"
                            className="rounded-xl border cursor-pointer border-red-200 px-5 py-2.5 font-medium text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                            onClick={() => setShowModal(true)}
                        >
                            Delete
                        </button>
                    </div>
                }
            </header>

            {/* Main image */}
            <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
                {listing.image ?
                    <img src={listing.image?.path} alt="" className="h-full w-full object-cover" /> :
                    <span
                        className="h-full flex justify-center items-center text-gray-500 text-lg">No image</span>}
            </div>

            {/* Two columns on large screens: details left, price card right */}
            <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
                <section className="lg:col-span-2">
                    <p className="text-lg font-medium text-gray-900 italic">@{listing.owner.username}</p>
                    <hr className="my-6 border-gray-200" />
                    <h2 className="mb-2 text-xl font-semibold text-gray-900">About this place</h2>
                    <p className="leading-relaxed text-gray-700">
                        {listing.description}</p>
                </section>

                <aside className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <p className="text-xl font-semibold text-gray-900">
                            &#8377;{listing.price.toLocaleString("en-IN")} <span className="text-base font-normal text-gray-600">/ night</span>
                        </p>
                        <p className="mt-1 text-sm italic text-gray-500">+  &#8377;{gst.toLocaleString("en-IN")} / 18% GST</p>
                        <button className="mt-4 w-full rounded-xl bg-rose-500 py-3 font-semibold text-white hover:bg-rose-600">
                            Book - &#8377;{totalPrice.toLocaleString("en-IN")}
                        </button>
                    </div>
                </aside>
            </div>

            {/* Map */}
            <section className="mt-12">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Where you'll be</h2>
                <div className="relative isolate z-0 h-80 overflow-hidden rounded-2xl sm:h-96">
                    {/* map goes here, give it h-full w-full */}
                    <Map coordinates={listing.geometry.coordinates} title={listing.title} />
                </div>
            </section>


            {/* Reviews */}
            <section className="mt-12 border-t border-gray-200 pt-10">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">Reviews</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* review cards */}
                    {reviews?.length === 0 ?
                        <p className="text-gray-500">
                            No reviews yet.
                        </p>
                        :
                        reviews.map((r) => <ReviewCard
                            listingId={listing._id}
                            onReviewEdit={onReviewEdit}
                            key={r._id}
                            review={r}
                            setReviews={setReviews} />)}
                </div>
            </section>

            {showLeaveReview ? <CreateReview onReviewCreate={onReviewCreate} /> :
                <button
                    type="button"
                    onClick={handleLeaveReview}
                    className="cursor-pointer mt-10 rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Leave a review
                </button>}
        </div>
    );
}

export default ListingDetails;