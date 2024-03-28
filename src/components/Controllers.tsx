import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import IController from '../interfaces/IController';
import TracApi from '../services/trac-api';
import ControllerForm from './forms/ControllerForm';
import IPageSate from '../interfaces/IPageState';

const Api = TracApi();


export default function Controllers() {
    type PageState = {
        controllers: IController[],
        existing?: IController,
        showModal: boolean
    };

    const [initialState, setInitialState] = useState<PageState>({
        controllers: [],
        showModal: false
    });

    useEffect(() => {
        const setState = async () => {
            const controllers = await Api.controllerList();
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
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {initialState.controllers.map(val => (
                        <tr key={val.number}>
                            <td>{val.number} ({val.altNumber})</td>
                            <td>{val.description}</td>
                            <td>{val.saturation &&
                                <>Min: <strong>{val.saturation.min}</strong>
                                    &nbsp;Middle: <strong>{val.saturation.middle} </strong>
                                    &nbsp;Max: <strong>{val.saturation.max}</strong></>}</td>
                            <td>{val.tracCycles}</td>
                            <td>
                                <Button variant="link" onClick={() => {
                                    setInitialState({
                                        controllers: [],
                                        showModal: true,
                                        existing: val
                                    })
                                }}>
                                    Edit
                                </Button>
                                <Link to={`controller/${val.number}`}>
                                    <Button variant='link'>View</Button>
                                </Link>

                            </td>
                        </tr>
                    )
                    )}
                </tbody>
            </Table >)
    };

    return (
        <>
            <br />
            <Row>
                <Col >
                    <h2>Controllers</h2>
                </Col>
                <Col >
                    <Button className="float-right" onClick={() => {
                        setInitialState({ ...initialState, showModal: true })
                    }}>New
                    </Button>
                </Col>
            </Row>
            <br />
            {renderTable()}
            {initialState.showModal && <ControllerForm
                data={initialState.existing}
                save={saveAndCloseModal}
                existingControllers={initialState.controllers.map(val => val.number)} />}
        </>
    )



}
