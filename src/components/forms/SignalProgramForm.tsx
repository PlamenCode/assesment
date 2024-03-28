import React from 'react';
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
}

export default class SignalProgramForm extends React.Component<FormProps, FormState> {
    state: FormState = {
        number: this.props.data?.number,
        greenLength: this.props.data?.greenLength || 60
    }

    handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!this.state.number) {
            this.setState({ error: 'No Signal program' })
            return;
        }

        if (this.props.existingSps && this.props.existingSps.indexOf(this.state.number) >= 0) {
            this.setState({ error: 'Signal program already exists' });
            return;
        }

        this.setState({ error: undefined })
        const model = {
            controller: +this.props.controller,
            heading: this.props.heading,
            number: this.state.number,
            greenLength: this.state.greenLength
        }
        if (!!this.props.data) {
            await Api.editSp(model);
        } else {
            await Api.addSp(model);
        }

        this.props.save();
    }

    render() {
        return (
            <Modal
                show={true}
                onHide={() => this.props.save()}
                backdrop="static"
                keyboard={true}>
                <Modal.Header>
                    <Modal.Title>{this.props.data ? 'Edit' : 'Add new'} signal program {this.props.heading && ` for heading ${this.props.heading}`}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={this.handleSubmit}>
                    <Modal.Body>
                        <Form.Group controlId='sp'>
                            <Form.Label>Signal program</Form.Label>
                            <Form.Control type='number' disabled={!!this.props.data} min='1' max='8'
                                onChange={e => this.setState({ number: +e.target.value })}
                                value={this.state.number}
                                isInvalid={!!this.state.error} />
                            <Form.Control.Feedback type='invalid'>
                                {this.state.error}
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
                            <Form.Control type='number' min='8' max='120' defaultValue='60' step='1'
                                onChange={e => this.setState({ greenLength: +e.target.value })}
                                value={this.state.greenLength} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.save()}>Cancel</Button>
                        <Button type="submit">{!this.props.data ? 'Add' : 'Edit'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}
