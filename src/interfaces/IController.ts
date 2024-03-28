import ISaturationConfig from "./ISaturationConfig";

export default interface IController {
    number: number,
    altNumber: number,
    description: string,
    saturation: ISaturationConfig,
    tracCycles: number
}