export function getListingPublicationError(verificationStatus: string | undefined, requestedQuantity: number, availableQuantity: number): string | undefined {
  if (verificationStatus !== "VERIFIED") {
    return "A VERIFIED verification record is required before publishing";
  }
  if (requestedQuantity > availableQuantity) {
    return "Listing quantity exceeds available inventory";
  }
}
