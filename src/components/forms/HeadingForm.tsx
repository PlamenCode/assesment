import React from 'react';
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

export default class HeadingForm extends React.Component<FormProps, FormState> {
  state: FormState = { ...this.props.data }

  handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!this.state.number) {
      this.setState({ error: 'Heading not specified' })
      return
    }

    if (!this.props.data && this.props.existingHeadings && this.props.existingHeadings.indexOf(this.state.number) >= 0) {
      this.setState({ error: 'Heading already exists' })
      return
    }

    const { number, weight, description } = this.state;
    const model = {
      controller: this.props.controller,
      number: number,
      weight: weight,
      description: description
    }
    if (!!this.props.data) {
      await Api.editHeading(model)
    } else {
      await Api.addHeading(model)
    }

    this.props.hide();
  }

  render() {
    const { data, hide } = this.props
    return (
      <Modal
        show={true}
        onHide={hide}
        backdrop="static"
        keyboard={true}>
        <Modal.Header>
          <Modal.Title>{data ? 'Edit' : 'Add new'} heading </Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Body>
            <Form.Group controlId='heading'>
              <Form.Label>Heading</Form.Label>
              <Form.Control type='number' disabled={!!data} min='1'
                onChange={e => this.setState({ number: +e.target.value })}
                value={this.state.number}
                isInvalid={!!this.state.error} />
              <Form.Control.Feedback type='invalid'>
                {this.state.error}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId='weight'>
              <Form.Label>Weight</Form.Label>
              <Form.Control type='number' step='1'
                onChange={e => this.setState({ weight: +e.target.value })}
                value={this.state.weight} />
            </Form.Group>
            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control type='input'
                onChange={e => this.setState({ description: e.target.value })}
                value={this.state.description} />
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
}
