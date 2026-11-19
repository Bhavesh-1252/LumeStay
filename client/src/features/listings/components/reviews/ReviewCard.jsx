import { useState } from "react";
import ReviewEditForm from "./ReviewEditForm";
import ReviewCardDetails from "./ReviewCardDetails";
import ConfirmModal from "../listings/ConfirmModal";
import useFlashMessage from "../../../../hooks/useFlashMessage";
import useReview from "../../hooks/useReview";

export default function ReviewCard({ listingId, review, onReviewEdit, setReviews }) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { showFlash } = useFlashMessage();
  const { handleDeleteReview } = useReview();

  const onReviewDelete = async (reviewId) => {
    setDeleting(true);
    try {
      const response = await handleDeleteReview(listingId, reviewId);
      if (!response.success) {
        showFlash(response.message);
        return;
      }


      setReviews((prev) => {
        return prev.filter((r) => r._id !== reviewId);
      })
      showFlash(response.message, "success");
    } catch (error) {
      showFlash(error.message);
    }
    finally {
      setDeleting(false);
      setShowModal(false);
    }
  }


  return (
    <article className="rounded-2xl border border-gray-200 p-5">

      {showModal &&
        <ConfirmModal
          showModal={showModal}
          onCancel={() => setShowModal(false)}
          deleting={deleting}
          onDelete={() => onReviewDelete(review._id)}
        />
      }
      {
        showEditForm ?
          <ReviewEditForm
            setShowEditForm={setShowEditForm}
            review={review}
            onReviewEdit={onReviewEdit} />
          :
          <ReviewCardDetails
            onDeleteReview={() => setShowModal(true)}
            review={review}
            setShowEditForm={setShowEditForm} />
      }
    </article >
  );
}