import axios from "axios";
import cfg from "../config";
import IController from "../interfaces/IController";

const client = () => axios.create({ baseURL: cfg.baseUrl });

const get = async (route: string) => {
    const result = await (client()).get(route);
    return result.data;
};

const post = async (route: string, body: any) => {
    const result = await (client()).post(route, body);
    return result.data;
};

const put = async (route: string, body: any) => {
    const result = await (client()).put(route, body);
    return result.data;
};

export default function TracApi() {

    const controllerList = async () => await get('controllers');
    const addController = async (model: IController) => await post('controllers', model)
    const editController = async (model: IController) => await put('controllers', model)

    const getHeadingsForController = async (controller: number) => await get(`headings/${controller}`);
    const addHeading = async (model: any) => await post('headings', model);
    const editHeading = async (model: any) => await put('headings', model);

    const addSp = async (body: any) => await post('signalprograms', body)
    const editSp = async (body: any) => await put('signalprograms', body)

    const addLine = async (body: any) => await post('lines', body)
    const editLine = async (body: any) => await put('lines', body)

    return{
        controllerList,
        addController,
        editController,
        getHeadingsForController,
        addHeading,
        editHeading,
        addSp,
        editSp,
        addLine,
        editLine,
    }
}