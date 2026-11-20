import { useState } from "react";
import ReviewEditForm from "./ReviewEditForm";
import ReviewCardDetails from "./ReviewCardDetails";
import ConfirmModal from "../listings/ConfirmModal";
import useFlashMessage from "../../../../hooks/useFlashMessage";
import useReview from "../../hooks/useReview";

export default function ReviewCard({ listingId, review, setReviews }) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { showFlash } = useFlashMessage();
  const { handleDeleteReview, handleEditReview } = useReview();

  const onReviewDelete = async () => {
    setDeleting(true);
    try {
      const response = await handleDeleteReview(listingId, review._id);
      if (!response.success) {
        showFlash(response.message, "error");
        return;
      }

      setReviews((prev) => prev.filter((r) => r._id !== review._id));

      showFlash(response.message, "success");
      setShowModal(false);
    } catch (error) {
      showFlash(error.message, "error");
    }
    finally {
      setDeleting(false);
    }
  }

  const onReviewEdit = async (review, reviewId) => {
    const response = await handleEditReview(review, listingId, reviewId);
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
    <article className="rounded-2xl border border-gray-200 p-5">

      {showModal &&
        <ConfirmModal
          heading={"Delete this review?"}
          onCancel={() => setShowModal(false)}
          deleting={deleting}
          onDelete={() => onReviewDelete()}

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