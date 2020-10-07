import { lazy } from "react";

const ButtonComponent = lazy(() => import("./ButtonComponent"));
const FormComponent = lazy(() => import("./FormComponent"));
const StepperComponent = lazy(() => import(`./StepperComponent`));

export { ButtonComponent, FormComponent, StepperComponent };
