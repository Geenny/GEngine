import Struct from "../../data/content/struct/Struct";
import ScreenVO from "../dependencies/engine/modules/modules/screen/vo/ScreenVO";
import PixiNodeType from "../dependencies/engine/modules/modules/screen/pixi/constants/PixiNodeType";
import NodeAlignType from "../dependencies/engine/modules/modules/screen/pixi/constants/NodeAlignType";
import NodeFillType from "../dependencies/engine/modules/modules/screen/pixi/constants/NodeFillType";
import NodeSequenceType from "../dependencies/engine/modules/modules/screen/pixi/constants/NodeSequenceType";
import PixiScreen from "../dependencies/engine/modules/modules/screen/pixi/screen/PixiScreen";
import ScreenName from "./ScreenName";

const screenData = {
    type: PixiNodeType.CONTAINER,
    name: "Main",
    sequence: NodeSequenceType.NONE,
    parameters: { },
    list: [
        {
            type: PixiNodeType.GRAPHICS,
            name: "BlackBackground",
            fill: NodeFillType.FULL,
            align: NodeAlignType.TL,
            parameters: {
                width: "100%",
                height: "100%"
            },
            nodeParameters: {
                fillIs: true,
                fillColor: 0x060606,
                fillAlpha: 1,
                lineIs: false,
                drawRect: true,
                drawCircle: false
            }
        },
        {
            type: PixiNodeType.CONTAINER,
            name: "TextContainer",
            fill: NodeFillType.FULL,
            align: NodeAlignType.BC,
            parameters: {
                width: "100%",
                height: "100%"
            }
        },
    ]
};

export default {
    ... Struct,
    ID: 1,
    name: ScreenName.LOADING,
    class: PixiScreen,
    classVO: ScreenVO,
    options: {
        layer: 0,
        screenPopup: false,
        screenDefault: true,
        screenData
    }
}