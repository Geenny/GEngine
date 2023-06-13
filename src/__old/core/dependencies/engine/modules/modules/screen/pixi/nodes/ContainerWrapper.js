import { Container } from "pixi.js";

export default class ContainerWrapper extends Container {

    resize( size ) {
        this.size = size;
    }

}