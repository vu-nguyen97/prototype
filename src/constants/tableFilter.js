import { ROLES } from "./constants";

export const STATUS_FILTER = [
  {
    text: "Failure",
    value: "Failure",
  },
  {
    text: "Success",
    value: "Success",
  },
];

export const ROLE_FILTER = [
  {
    text: "Admin",
    value: ROLES.admin,
  },
  {
    text: "User",
    value: ROLES.user,
  },
];
