import Struct from "../../../../../../../../data/content/struct/Struct";
import PixiBuilder from "../builder/PixiBuilder";
import PixiBuilderVO from "../builder/PixiBuilderVO";
import ScreenName from "../../constants/ScreenName";

export default {
    ... Struct,
    ID: 1,
    name: ScreenName.PIXI,
    class: PixiBuilder,
    classVO: PixiBuilderVO
};