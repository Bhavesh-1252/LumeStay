const ConfirmModal = ({ onCancel, deleting, onDelete }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-gray-900">
                    Delete this listing?
                </h2>
                <p className="mt-2 text-gray-600">
                    This can't be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        className="rounded-xl cursor-pointer border border-gray-300 px-5 py-2.5 font-medium text-gray-900 hover:bg-gray-100"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="rounded-xl cursor-pointer bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={onDelete}
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;