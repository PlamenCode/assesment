import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import IHeading from '../../interfaces/IHeading';
import TracApi from '../../services/trac-api';

const Api = TracApi();

type FormState = {
    number?: number,
    weight?: number,
    description?: string,
    error?: string
}

type FormProps = {
    controller: number,
    data?: IHeading,
    existingHeadings?: number[],
    hide: () => void
}

export default function HeadingForm(props: FormProps) {
    const [state, setState] = useState<FormState>({ ...props.data });
    const {data, hide} = props;

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!state.number) {
            setState({ error: 'Heading not specified' })
            return
        }

        if (!props.data && props.existingHeadings && props.existingHeadings.indexOf(state.number) >= 0) {
            setState({ error: 'Heading already exists' })
            return
        }

        const { number, weight, description } = state;
        const model = {
            controller: props.controller,
            number: number,
            weight: weight,
            description: description
        }
        if (!!props.data) {
            await Api.editHeading(model)
        } else {
            await Api.addHeading(model)
        }

        props.hide();
    };

    return (
    <Modal
        show={true}
        onHide={hide}
        backdrop="static"
        keyboard={true}>
        <Modal.Header>
            <Modal.Title>{data ? 'Edit' : 'Add new'} heading </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
            <Modal.Body>
                <Form.Group controlId='heading'>
                    <Form.Label>Heading</Form.Label>
                    <Form.Control type='number' disabled={!!data} min='1'
                        onChange={e => setState({ ...state, number: +e.target.value })}
                        value={state.number}
                        isInvalid={!!state.error} />
                    <Form.Control.Feedback type='invalid'>
                        {state.error}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId='weight'>
                    <Form.Label>Weight</Form.Label>
                    <Form.Control type='number' step='1'
                        onChange={e => setState({ ...state, weight: +e.target.value })}
                        value={state.weight} />
                </Form.Group>
                <Form.Group controlId='description'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control type='input'
                        onChange={e => setState({ ...state, description: e.target.value })}
                        value={state.description} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={hide}>Cancel</Button>
                <Button type="submit">{!data ? 'Add' : 'Edit'}</Button>
            </Modal.Footer>
        </Form>
    </Modal>
)
}
