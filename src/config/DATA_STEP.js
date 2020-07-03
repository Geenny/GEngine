import StartStep from "../core/step/BeginScreen";
import LoadingStep from "../core/step/LoadingScreen";
import ApplicationStep from "../core/step/ApplicationScreen";

const DATA = {
    stepStructList: [
        { name: "Start", step: StartStep, stepNames: [ "LogoCo" ] },
        { name: "Loading", skip: true, step: LoadingStep, stepNames: [ "Logo" ] },
        { name: "Application", skip: true, step: ApplicationStep, stepNames: [ "MenuMain" ] }
    ]
}

export default DATA;