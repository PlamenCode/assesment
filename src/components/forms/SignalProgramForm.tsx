import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import ISignalProgram from '../../interfaces/ISignalProgram';
import TracApi from '../../services/trac-api';

const Api = TracApi();

type FormState = {
    number?: number,
    greenLength?: number,
    error?: string,
};

type FormProps = {
    data?: ISignalProgram,
    controller: number
    heading?: number,
    existingSps?: number[],
    save: () => void
};

export default function SignalProgramForm(props: FormProps) {
    const [state, setState] = useState<FormState>({
        number: props.data?.number,
        greenLength: props.data?.greenLength || 60
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!state.number) {
            setState({ ...state, error: 'No Signal program' })
            return;
        }

        if (props.existingSps && props.existingSps.indexOf(state.number) >= 0) {
            setState({ ...state, error: 'Signal program already exists' });
            return;
        }

        setState({ ...state, error: undefined })
        const model = {
            controller: + props.controller,
            heading: props.heading,
            number: state.number,
            greenLength: state.greenLength
        }
        if (!!props.data) {
            await Api.editSp(model);
        } else {
            await Api.addSp(model);
        }

        props.save();
    };

    return (
        <Modal
            show={true}
            onHide={() => props.save()}
            backdrop="static"
            keyboard={true}>
            <Modal.Header>
                <Modal.Title>{props.data ? 'Edit' : 'Add new'} signal program {props.heading && ` for heading ${props.heading}`}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId='sp'>
                        <Form.Label>Signal program</Form.Label>
                        <Form.Control type='number' disabled={!!props.data} min='1' max='8'
                            onChange={e => setState({ number: +e.target.value })}
                            defaultValue={state.number}
                            isInvalid={!!state.error} />
                        <Form.Control.Feedback type='invalid'>
                            {state.error}
                        </Form.Control.Feedback>
                    </Form.Group>
                    {/* <Form.Group controlId='weight'>
                            <Form.Label>Weight</Form.Label>
                            <Form.Control type='number' min='0'
                                onChange={e => this.setState({ weight: +e.target.value })}
                                value={this.state.weight} />
                        </Form.Group> */}
                    <Form.Group controlId='greenLength'>
                        <Form.Label>Green Length - seconds</Form.Label>
                        <Form.Control type='number' min='8' max='120' step='1'
                            onChange={e => setState({ ...state, greenLength: +e.target.value })}
                            value={state.greenLength || '60'} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => props.save()}>Cancel</Button>
                    <Button type="submit">{!props.data ? 'Add' : 'Edit'}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}
