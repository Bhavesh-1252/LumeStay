const ListingFormField = ({ id, label, error, ...inputProps }) => {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                {label}
            </label>

            <div>
                <input
                    id={id}
                    name={id}
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${error
                            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-[#FF385C] focus:ring-[#FF385C]/20"
                        }`}
                    {...inputProps}
                />
            </div>

            {error &&
                <p className="mt-1.5 text-xs text-red-600">
                    {error}
                </p>}
        </div>
    );
}

export default ListingFormField;