import React from 'react';
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

export default class ControllerForm extends React.Component<FormProps, FormState> {
  state = initState;

  componentDidMount = async () => {
    if (this.props.data) {
      this.setState({
        number: this.props.data.number.toString(),
        altNumber: this.props.data.altNumber.toString(),
        description: this.props.data.description,
        saturation: this.props.data.saturation
      })
    }
  }

  handleSubmit = async (e: any) => {
    e.preventDefault();
    const { min, middle, max } = e.target.elements;
    if (!this.props.data && this.state.number && this.props.existingControllers.indexOf(+this.state.number) >= 0) {
      this.setState({ controllerError: 'Controller already exists' })
      return;
    } else if (!this.state.number) {
      this.setState({ controllerError: 'No controller' })
      return;
    }

    this.setState({ controllerError: '' })

    const model: IController = {
      number: +this.state.number,
      altNumber: +this.state.altNumber,
      description: this.state.description,
      saturation: { min: min.valueAsNumber, middle: middle.valueAsNumber, max: max.valueAsNumber },
      tracCycles: this.state.tracCycles
    };
    if (this.props.data) {
      await Api.editController(model)

    } else {
      await Api.addController(model)
    }

    this.props.save()
  }

  render() {
    const { saturation, tracCycles } = this.state
    return (
      <Modal
        show={true}
        onHide={() => this.props.save()}
        backdrop="static"
        keyboard={true}>
        <Modal.Header>
          <Modal.Title>{this.props.data ? 'Edit' : 'Add new'} controller</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <ModalBody>
            <Row>
              <Form.Group as={Col} controlId='controller'>
                <Form.Label>Intersection</Form.Label>
                <Form.Control type='number' step='1' disabled={!!this.props.data}
                  onChange={e => this.setState({ number: e.target.value })}
                  isInvalid={!!this.state.controllerError}
                  value={this.state.number} />
                <Form.Control.Feedback type='invalid'>
                  {this.state.controllerError}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId='altNumber'>
                <Form.Label>Plovdiv number</Form.Label>
                <Form.Control type='number' step='1'
                  onChange={e => this.setState({ altNumber: e.target.value })}
                  value={this.state.altNumber} />
              </Form.Group>
            </Row>
            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control type='text' placeholder='Intersection description'
                onChange={e => this.setState({ description: e.target.value })}
                value={this.state.description} />
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
                        onChange={e => { saturation!.min = +e.target.value; this.setState({ saturation }) }}
                        value={saturation?.min} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId='middle'>
                      <Form.Label>Middle</Form.Label>
                      <Form.Control type='number' step='0.1'
                        onChange={e => { saturation!.middle = +e.target.value; this.setState({ saturation }) }}
                        value={saturation?.middle} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId='max'>
                      <Form.Label>Max</Form.Label>
                      <Form.Control type='number' step='0.1'
                        onChange={e => { saturation!.max = +e.target.value; this.setState({ saturation }) }}
                        value={saturation?.max} />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col>
                Trac
                <Form.Group controlId='tracCycles'>
                  <Form.Label>Cycles</Form.Label>
                  <Form.Control type='number' step='1' defaultValue='5'
                    onChange={e => { this.setState({ tracCycles: +e.target.value }) }}
                    value={tracCycles} />
                </Form.Group>
              </Col>

            </Row>
          </ModalBody>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.props.save()}>Cancel</Button>
            <Button type="submit">{!this.props.data ? 'Add' : 'Edit'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}
