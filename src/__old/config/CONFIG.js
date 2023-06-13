
import DATA_STEP from "./DATA_STEP";
import DATA_TICKER from "./DATA_TICKER";
import DATA_DEPENDENCY from "./DATA_DEPENDENCY";

const MAIN = {
    main: {
        vo: {
            dependencyMachineVO: DATA_DEPENDENCY,
            tickerMachineVO: DATA_TICKER,
            stepMachineVO: DATA_STEP
        }
    }
};

export { MAIN };
