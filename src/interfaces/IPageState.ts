import IController from '../interfaces/IController';

export default interface IPageSate {
    controllers: IController[],
    existing?: IController,
    showModal: boolean
}