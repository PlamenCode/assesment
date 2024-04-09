import { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import IController from '../interfaces/IController';
import TracApi from '../services/trac-api';
import ControllerForm from './forms/ControllerForm';
import { BallTriangle } from 'react-loader-spinner'

const Api = TracApi();

type PageState = {
    controllers: IController[],
};

export default function Controllers() {
    const [initialState, setInitialState] = useState<PageState>({ controllers: [] });
    const [showModal, setShowModal] = useState<Boolean>(false);
    const [existing, setExisting] = useState<IController>();
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const controllers = await Api.controllerList();
            setInitialState({ controllers });
            setHasLoaded(true);
        };
        fetchData();
    }, []);

    const saveAndCloseModal = () => {
        setShowModal(false);
        setExisting(undefined);
        window.location.reload();
    };

    const renderTable = () => {
        if (hasLoaded) return (
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
                                    setExisting(val);
                                    setShowModal(true);
                                }}>Edit</Button>

                                <Link to={`controller/${val.number}`}>
                                    <Button variant='link'>View</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table >
        )
        if (!hasLoaded) return (
            <div className="spinner">
                <BallTriangle
                    height={100}
                    width={100}
                    radius={5}
                    color="##0d6efd"
                    ariaLabel="ball-triangle-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
            </div>
        )
    };

    return (
        <>
            <br />
            <Row>
                <Col><h2>Controllers</h2></Col>
                <Col >
                    <Button className="float-right" onClick={() => {
                        setShowModal(true)
                    }}
                    >New</Button>
                </Col>
            </Row>
            <br />
            {renderTable()}
            {showModal && <ControllerForm
                data={existing}
                save={saveAndCloseModal}
                existingControllers={initialState.controllers.map(val => val.number)} />
            }
        </>
    )
}
