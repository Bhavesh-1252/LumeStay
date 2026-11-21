import ListingCard from "./ListingCard";

const ListingsContainer = ({ listings }) => {
    return (
        <section className="mx-auto max-w-screen-2xl px-6 py-8 lg:px-28">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* map your cards here */}
                {listings?.length && listings.map((l) => <ListingCard key={l._id} listing={l} />)}
            </div>
        </section>
    );
}

export default ListingsContainer;