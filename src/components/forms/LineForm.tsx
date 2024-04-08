import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import ILine from '../../interfaces/ILine';
import TracApi from '../../services/trac-api';

const Api = TracApi();

type FormState = {
	number?: number,
	saturation?: number,
	heading?: number,
	error?: string,
};

type FormProps = {
	data?: ILine,
	controller: number
	heading?: number,
	existingLines?: number[],
	save: () => void
};

export default function LineForm( props: FormProps) {
    const [state, setState] = useState<FormState>({
		heading: props.heading,
		number: props.data?.number,
		saturation: props.data?.saturation
	});

    const handleSubmit = async (e: any) => {
        e.preventDefault();
		if (!state.number) {
			setState({ ...state, error: 'Line not specified' })
			return;
		}

		if (props.existingLines && props.existingLines.indexOf(state.number) >= 0) {
			setState({ ...state, error: 'Line already exists' })
		}

		setState({ error: undefined })
		const model = {
			controller: props.controller,
			heading: state.heading,
			number: state.number,
			saturation: state.saturation
		}
		if (!!props.data) {
			await Api.editLine(model);
		} else {
			await Api.addLine(model);
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
            <Modal.Title>{props.data ? 'Edit' : 'Add new'} line {props.heading && ` for heading ${props.heading}`}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
            <Modal.Body>
                {!props.heading &&
                    <Form.Group controlId='heading'>
                        <Form.Label>Heading</Form.Label>
                        <Form.Control as='input' type='number'
                            onChange={async e => setState({ ...state, heading: +e.target.value })} >
                        </Form.Control>
                    </Form.Group>
                }
                <Form.Group controlId='line'>
                    <Form.Label>Line</Form.Label>
                    <Form.Control type='number' disabled={!!props.data} min='1'
                        onChange={e => setState({ ...state, number: +e.target.value })}
                        defaultValue={state.number}
                        isInvalid={!!state.error} />
                    <Form.Control.Feedback type='invalid'>
                        {state.error}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId='saturation'>
                    <Form.Label>Saturation</Form.Label>
                    <Form.Control type='number' step='0.1'
                        onChange={e => setState({ ...state, saturation: +e.target.value })}
                        defaultValue={state.saturation} />
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
