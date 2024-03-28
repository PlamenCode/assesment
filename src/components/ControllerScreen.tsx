import React from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { useParams } from 'react-router-dom';
import IHeading from '../interfaces/IHeading';
import IHeadingResponse from '../interfaces/IHeadingResponse';
import ILine from '../interfaces/ILine';
import ISignalProgram from '../interfaces/ISignalProgram';
import TracApi from '../services/trac-api';
import HeadingForm from './forms/HeadingForm';
import LineForm from './forms/LineForm';
import SignalProgramForm from './forms/SignalProgramForm';
// import * as l from 'linq';

const Api = TracApi();

type ScreenState = {
  headings?: IHeadingResponse[],
  showSpModal: boolean,
  showLineModal: boolean,
  showHeadingModal: boolean,
  currentSp?: ISignalProgram,
  selectedHeading?: number
  spsPerCurrentHeading?: number[],
  currentLine?: ILine,
  linesPerCurrentHeading?: number[],
  currentHeading?: IHeading
}

class ControllerScreen extends React.Component<{ params: any }, ScreenState> {
  state: ScreenState = { showSpModal: false, showLineModal: false, showHeadingModal: false }
  private id?: number;

  componentDidMount = async () => {
    this.id = this.props.params['id'];
    const headings = await Api.getHeadingsForController(this.id!);
    this.setState({ headings })
  }

  saveAndCloseSpModal = () => this.setState({
    showSpModal: false,
    selectedHeading: undefined,
    currentSp: undefined,
    spsPerCurrentHeading: undefined
  })

  saveAndCloseLineModal = () => this.setState({
    showLineModal: false,
    selectedHeading: undefined,
    currentLine: undefined,
    linesPerCurrentHeading: undefined
  })

  saveAndCloseHeadingsModal = () => this.setState({
    showHeadingModal: false,
    currentHeading: undefined
  })

  renderHeadings = () => <Accordion>
    {this.state.headings?.map(val =>
    (<Card key={val.number}>
      <Card.Header>
      <Row>
      <Col>
        <Accordion.Toggle as={Button} variant="link" eventKey={this.state.headings!.indexOf(val).toString()}>          
            Heading {val.number}{val.description && ` - ${val.description}`}
        </Accordion.Toggle>
        </Col>
        <Col><h4>Weight: <strong>{val.weight}</strong></h4></Col>
        <Col>
        <Button onClick={() => {
            this.setState({ showHeadingModal: true , currentHeading: val})
          }}>Edit
          </Button></Col>
        </Row>
      </Card.Header>
      <Accordion.Collapse eventKey={this.state.headings!.indexOf(val).toString()}>
        <Card.Body>
          
          <Row className="justify-content-md-center">
            <Col>
              {val.signalPrograms?.length ? <>
                <h2>Signal programs</h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Program</th>
                      <th>GreenTime</th>
                      <th><Button onClick={() =>
                        this.setState({
                          showSpModal: true,
                          selectedHeading: val.number,
                          spsPerCurrentHeading: val.signalPrograms?.map(sp => sp.number)
                        })
                      }>
                        New
                      </Button></th>
                    </tr>
                  </thead>
                  <tbody>
                    {val.signalPrograms.map(sp =>
                      <tr key={sp.number}>
                        <td>{sp.number}</td>
                        <td>{sp.greenLength}</td>
                        <td>
                          <Button variant="link" onClick={() => {
                            this.setState({
                              showSpModal: true,
                              selectedHeading: val.number,
                              currentSp: {
                                number: sp.number,
                                greenLength: sp.greenLength
                              }
                            })
                          }}>
                            Edit
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table> </>
                : (<>
                  <h4>No signal programs set</h4>
                  <Button variant="success" onClick={() => {
                    this.setState({
                      showSpModal: true,
                      selectedHeading: val.number,
                      spsPerCurrentHeading: val.signalPrograms?.map(sp => sp.number)
                    })
                  }}>
                    New Signal program
                  </Button>
                </>)}
            </Col>
            <Col>
              {val.lines?.length ? <>
                <h2>Lines</h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Line</th>
                      <th>Saturation</th>
                      <th>
                        <Button onClick={() => {
                          this.setState({
                            showLineModal: true,
                            selectedHeading: val.number,
                            linesPerCurrentHeading: val.lines?.map(sp => sp.number)
                          })
                        }}>
                          New
                        </Button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {val.lines?.map(l =>
                      <tr key={l.number}>
                        <td>{l.number}</td>
                        <td>{l.saturation}</td>
                        <td>
                          <Button variant="link" onClick={() => {
                            this.setState({
                              showLineModal: true,
                              selectedHeading: val.number,
                              currentLine: {
                                number: l.number,
                                saturation: l.saturation
                              }
                            })
                          }}>
                            Edit
                          </Button>
                        </td>
                      </tr>)}
                  </tbody>
                </Table> </>
                : <>
                  <h3>No lines set</h3>
                  <Button variant="success" onClick={_ => this.setState({
                      showLineModal: true,
                      selectedHeading: val.number,
                      linesPerCurrentHeading: val.lines?.map(sp => sp.number)
                    })}          >
                    New Line
                  </Button>
                </>}
            </Col>
          </Row>
        </Card.Body>
      </Accordion.Collapse>
    </Card>)
    )}
  </Accordion>

  render = () => {
    return (<>
      <br />
      <Row>
        <Col>
          <h2>Controller {this.id}</h2>
        </Col>
        <Col >
          <Button variant='success' onClick={() => {
            this.setState({ showHeadingModal: true })
          }}>New Heading
          </Button>
        </Col>
      </Row>
      {this.renderHeadings()}
      {this.state.showSpModal && <SignalProgramForm
        existingSps={this.state.spsPerCurrentHeading}
        controller={this.id!}
        data={this.state.currentSp}
        heading={this.state.selectedHeading}
        save={this.saveAndCloseSpModal} />}
      {this.state.showLineModal && <LineForm
        data={this.state.currentLine}
        heading={this.state.selectedHeading}
        controller={this.id!}
        save={this.saveAndCloseLineModal}
        existingLines={this.state.linesPerCurrentHeading} />}
      {this.state.showHeadingModal && <HeadingForm
        data={this.state.currentHeading}
        controller={this.id!}
        existingHeadings={this.state.headings?.map(val => val.number)}
        hide={this.saveAndCloseHeadingsModal} />}
    </>)
  }
}

const Controller = (props: any) => <ControllerScreen params={useParams()} />;
export default Controller;