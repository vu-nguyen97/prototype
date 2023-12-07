import { Group, Listing } from "./ListingForm/interface";

export const getGroupListing = (groups, id, allListing: Listing[]) => {
  let results = allListing || [];

  groups.forEach((group: Group) => {
    const gListing = group.listing;

    if (!gListing || group.id === id) return;
    results = results.filter((el) => el.id !== gListing);
  });
  return results;
};
