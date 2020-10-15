import { lazy } from "react";

const ButtonComponent = lazy(() => import("./ButtonComponent"));
const UnlockModal = lazy(() => import("./UnlockModal"));

export { ButtonComponent, UnlockModal };
