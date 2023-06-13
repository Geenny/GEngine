import Struct from "../../../../../../../../data/content/struct/Struct";
import ThreeBuilder from "../builder/ThreeBuilder";
import ThreeBuilderVO from "../builder/ThreeBuilderVO";
import ScreenName from "../../constants/ScreenName";

export default {
    ... Struct,
    ID: 1,
    name: ScreenName.THREE,
    class: ThreeBuilder,
    classVO: ThreeBuilderVO
};