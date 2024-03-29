import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, ModalBody, Row } from 'react-bootstrap';
import IController from '../../interfaces/IController';
import ISaturationConfig from '../../interfaces/ISaturationConfig';
import TracApi from '../../services/trac-api';

const Api = TracApi();

type FormState = {
    number: string,
    altNumber: string,
    description: string,
    saturation?: ISaturationConfig,
    tracCycles: number,
    controllerError?: string
};

const initState: FormState = {
    number: '',
    altNumber: '',
    description: '',
    saturation: {
        min: 0.5,
        middle: 0.6,
        max: 0.7
    },
    tracCycles: 5
}

type FormProps = {
    data?: IController,
    existingControllers: number[],
    save: () => void
}


export default function ControllerForm(props: FormProps) {
    const [state, setState] = useState<FormState>(initState);
    const { saturation, tracCycles } = state;

    useEffect(() => {
        const setingState = async () => {
            if (props.data) {
                setState({
                    ...state,
                    number: props.data.number.toString(),
                    altNumber: props.data.altNumber.toString(),
                    description: props.data.description,
                    saturation: props.data.saturation
                })
            }
        };
        setingState();
        return () => { };
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const { min, middle, max } = e.target.elements;
        if (!props.data && state.number && props.existingControllers.indexOf(+state.number) >= 0) {
            setState({ ...state, controllerError: 'Controller already exists' })
            return;
        } else if (!state.number) {
            setState({ ...state, controllerError: 'No controller' })
            return;
        }

        setState({ ...state, controllerError: '' })

        const model: IController = {
            number: +state.number,
            altNumber: +state.altNumber,
            description: state.description,
            saturation: { min: min.valueAsNumber, middle: middle.valueAsNumber, max: max.valueAsNumber },
            tracCycles: state.tracCycles
        };
        if (props.data) {
            await Api.editController(model)

        } else {
            await Api.addController(model)
        }

        props.save()
    }

    return (
        <Modal
            show={true}
            onHide={() => props.save()}
            backdrop="static"
            keyboard={true}>
            <Modal.Header>
                <Modal.Title>{props.data ? 'Edit' : 'Add new'} controller</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <ModalBody>
                    <Row>
                        <Form.Group as={Col} controlId='controller'>
                            <Form.Label>Intersection</Form.Label>
                            <Form.Control type='number' step='1' disabled={!!props.data}
                                onChange={e => setState({ ...state, number: e.target.value })}
                                isInvalid={!!state.controllerError}
                                value={state.number} />
                            <Form.Control.Feedback type='invalid'>
                                {state.controllerError}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId='altNumber'>
                            <Form.Label>Plovdiv number</Form.Label>
                            <Form.Control type='number' step='1'
                                onChange={e => setState({ ...state, altNumber: e.target.value })}
                                value={state.altNumber} />
                        </Form.Group>
                    </Row>
                    <Form.Group controlId='description'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control type='text' placeholder='Intersection description'
                            onChange={e => setState({ ...state, description: e.target.value })}
                            value={state.description} />
                    </Form.Group>
                    <hr />
                    <h5>Config</h5>
                    <Row>
                        <Col xs={8}>
                            Saturations
                            <Row className='saturationConfig'>
                                <Col>
                                    <Form.Group controlId='min'>
                                        <Form.Label>Min</Form.Label>
                                        <Form.Control type='number' step='0.1'
                                            onChange={e => { saturation!.min = +e.target.value; setState({ ...state, saturation }) }}
                                            value={saturation?.min} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId='middle'>
                                        <Form.Label>Middle</Form.Label>
                                        <Form.Control type='number' step='0.1'
                                            onChange={e => { saturation!.middle = +e.target.value; setState({ ...state, saturation }) }}
                                            value={saturation?.middle} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId='max'>
                                        <Form.Label>Max</Form.Label>
                                        <Form.Control type='number' step='0.1'
                                            onChange={e => { saturation!.max = +e.target.value; setState({ ...state, saturation }) }}
                                            value={saturation?.max} />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            Trac
                            <Form.Group controlId='tracCycles'>
                                <Form.Label>Cycles</Form.Label>
                                <Form.Control type='number' step='1' 
                                        /* defaultValue={5} */ // removed because there is a value
                                        // and it isn't allowed to have both value and defaultValue 
                                    onChange={e => { setState({ ...state, tracCycles: +e.target.value }) }}
                                    value={ tracCycles } />
                            </Form.Group>
                        </Col>

                    </Row>
                </ModalBody>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => props.save()}>Cancel</Button>
                    <Button type="submit">{!props.data ? 'Add' : 'Edit'}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}
