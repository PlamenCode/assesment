import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import IController from '../interfaces/IController';
import TracApi from '../services/trac-api';
import ControllerForm from './forms/ControllerForm';

const Api = TracApi();

type PageState = {
    controllers: IController[],
    existing?: IController,
    showModal: boolean
};

export default function Controllers() {
    const [initialState, setInitialState] = useState<PageState>({
        controllers: [],
        showModal: false
    });

    useEffect(() => {
        const setState = async () => {
            const controllers = await Api.controllerList();
            // Test Values 
            // const controllers = [
            //     {number: 1, altNumber: 2, description: 'Some Text', saturation: {min: 10, middle: 15, max: 20}, tracCycles: 5},
            //     {number: 3, altNumber: 4, description: 'Some Text 2', saturation: {min: 5, middle: 12, max: 18}, tracCycles: 4}];
            setInitialState({ ...initialState, controllers });
        };        
        setState();
        return () => { };
    }, []);

    const saveAndCloseModal = () => setInitialState({ ...initialState, showModal: false, existing: undefined })

    const renderTable = () => {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Controller</th>
                        <th>Description</th>
                        <th>Saturation</th>
                        <th>Trac phases</th>
                        {/* <th></th> removed for visual purpose*/} 
                    </tr>
                </thead>
                <tbody>
                    {initialState.controllers.map(val => (
                        <tr key={val.number}>
                            <td>{val.number} ({val.altNumber})</td>
                            <td>{val.description}</td>
                            <td>{val.saturation &&
                                <>
                                    Min: <strong>{val.saturation.min}</strong>
                                    &nbsp;Middle: <strong>{val.saturation.middle} </strong>
                                    &nbsp;Max: <strong>{val.saturation.max}</strong>
                                </>}
                            </td>
                            <td>{val.tracCycles}</td>
                            <td>
                                <Button variant="link" onClick={() => {
                                    setInitialState({
                                        controllers: [],
                                        showModal: true,
                                        existing: val
                                    })
                                }}>Edit</Button>

                                <Link to={`controller/${val.number}`}>
                                    <Button variant='link'>View</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table >)
    };

    return (
        <>
            <br />
            <Row>
                <Col><h2>Controllers</h2></Col>
                <Col >
                    <Button className="float-right" onClick={() => {
                        setInitialState({ ...initialState, showModal: true })}}
                    >New</Button>
                </Col>
            </Row>
            <br />
            {renderTable()}
            {initialState.showModal && <ControllerForm
                data={initialState.existing}
                save={saveAndCloseModal}
                existingControllers={initialState.controllers.map(val => val.number)} />
            }
        </>
    )
}
