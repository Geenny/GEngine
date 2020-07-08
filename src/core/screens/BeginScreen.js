import Struct from "../../data/content/struct/Struct";
import ScreenVO from "../../core/dependencies/engine/modules/modules/screen/vo/ScreenVO";
import NodeType from "../../core/dependencies/engine/modules/modules/screen/pixi/constants/NodeType";
import NodeAlignType from "../../core/dependencies/engine/modules/modules/screen/pixi/constants/NodeAlignType";
import NodeFillType from "../../core/dependencies/engine/modules/modules/screen/pixi/constants/NodeFillType";
import NodeSequenceType from "../../core/dependencies/engine/modules/modules/screen/pixi/constants/NodeSequenceType";
import PixiScreen from "../../core/dependencies/engine/modules/modules/screen/pixi/screen/PixiScreen";
import ScreenName from "./ScreenName";

const screenData = {
    type: NodeType.NODE,
    name: "Main",
    sequence: NodeSequenceType.NONE,
    parameters: { },
    list: [
        {
            type: NodeType.GRAPHICS,
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
    ]
};

export default {
    ... Struct,
    ID: 1,
    name: ScreenName.BEGIN,
    class: PixiScreen,
    classVO: ScreenVO,
    options: {
        layer: 0,
        screenPopup: false,
        screenDefault: true,
        screenData
    }
}