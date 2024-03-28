import React from 'react';
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
}

export default class LineForm extends React.Component<FormProps, FormState> {
  state: FormState = {
    heading: this.props.heading,
    number: this.props.data?.number,
    saturation: this.props.data?.saturation
  };

  handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!this.state.number) {
      this.setState({ error: 'Line not specified' })
      return;
    }

    if (this.props.existingLines && this.props.existingLines.indexOf(this.state.number) >= 0) {
      this.setState({ error: 'Line already exists' })
    }

    this.setState({ error: undefined })
    const model = {
      controller: this.props.controller,
      heading: this.state.heading,
      number: this.state.number,
      saturation: this.state.saturation
    }
    if(!!this.props.data){
      await Api.editLine(model);
    } else {
      await Api.addLine(model);
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
          <Modal.Title>{this.props.data ? 'Edit' : 'Add new'} line {this.props.heading && ` for heading ${this.props.heading}`}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Body>
            {!this.props.heading &&
              <Form.Group controlId='heading'>
                <Form.Label>Heading</Form.Label>
                <Form.Control as='input' type='number'
                  onChange={async e => this.setState({ heading: +e.target.value })} >
                </Form.Control>
              </Form.Group>
            }
            <Form.Group controlId='line'>
              <Form.Label>Line</Form.Label>
              <Form.Control type='number' disabled={!!this.props.data} min='1'
                onChange={e => this.setState({ number: +e.target.value })}
                value={this.state.number}
                isInvalid={!!this.state.error} />
              <Form.Control.Feedback type='invalid'>
                {this.state.error}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId='saturation'>
              <Form.Label>Saturation</Form.Label>
              <Form.Control type='number' step='0.1'
                onChange={e => this.setState({ saturation: +e.target.value })}
                value={this.state.saturation} />
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
