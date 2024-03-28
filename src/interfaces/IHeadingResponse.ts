import IHeading from "./IHeading";
import ILine from "./ILine";
import ISignalProgram from "./ISignalProgram";

export default interface IHeadingResponse extends IHeading {
    
    signalPrograms?: ISignalProgram[],
    lines?: ILine[]
}