import StartStep from "../core/step/StartStep";
import LoadingStep from "../core/step/LoadingStep";
import ApplicationStep from "../core/step/ApplicationStep";

const DATA = {
    steps: [
        { name: "Start", isDefault: true, step: StartStep, stepNames: [ "Loading" ] },
        { name: "Loading", step: LoadingStep, stepNames: [ "Application" ] },
        { name: "Application", step: ApplicationStep, stepNames: [ "Application" ] }
    ]
};

export default DATA;