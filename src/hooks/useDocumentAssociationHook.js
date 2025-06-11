import { useMemo } from "react";

/**
 * A custom hook to get a document's associated borrowers and comments
 * from the given loan data.
 *
 * @param {Object} loan  - The entire loan object (including comments, borrowers, etc.)
 * @param {string} docId - The _id of a specific loanDocument whose associations we want.
 *
 * @returns {{ comments: Array, borrowers: Array }}
 */
export function useDocumentAssociations(loan, docId) {
  /**
   * We’ll memoize this so it only recalculates when `loan` or `docId` changes.
   */
  return useMemo(() => {
    if (!loan || !docId || !loan.loanDocuments) {
      return { comments: [], borrowers: [] };
    }

    // 1. Find the specific loanDocument by its _id
    const targetDoc = loan.loanDocuments.find((doc) => doc._id === docId);
    if (!targetDoc || !targetDoc.associations) {
      return { comments: [], borrowers: [] };
    }

    // 2. Separate out the association IDs by entityType
    const commentIds = targetDoc.associations
      .filter((assoc) => assoc.entityType === "comments")
      .map((assoc) => assoc.entityId);

    const borrowerIds = targetDoc.associations
      .filter((assoc) => assoc.entityType === "borrower")
      .map((assoc) => assoc.entityId);

    // 3. Match those IDs against the loan’s comments and borrowers arrays
    const associatedComments = (loan.comments || []).filter((c) =>
      commentIds.includes(c._id)
    );
    const associatedBorrowers = (loan.borrowers || []).filter((b) =>
      borrowerIds.includes(b._id)
    );

    return {
      comments: associatedComments,
      borrowers: associatedBorrowers,
    };
  }, [loan, docId]);
}
