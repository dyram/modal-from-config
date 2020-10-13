import { lazy } from "react";

const ButtonComponent = lazy(() => import("./ButtonComponent"));
const UnlockDeviceModal = lazy(() => import("./UnlockDeviceModal"));

export { ButtonComponent, UnlockDeviceModal };
