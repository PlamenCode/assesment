import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import { useParams } from "react-router-dom";
import IHeading from "../interfaces/IHeading";
import IHeadingResponse from "../interfaces/IHeadingResponse";
import ILine from "../interfaces/ILine";
import ISignalProgram from "../interfaces/ISignalProgram";
import TracApi from "../services/trac-api";
import HeadingForm from "./forms/HeadingForm";
import LineForm from "./forms/LineForm";
import SignalProgramForm from "./forms/SignalProgramForm";

const Api = TracApi();

type ScreenState = {
  headings?: IHeadingResponse[];
  showSpModal: boolean;
  showLineModal: boolean;
  showHeadingModal: boolean;
  currentSp?: ISignalProgram;
  selectedHeading?: number;
  spsPerCurrentHeading?: number[];
  currentLine?: ILine;
  linesPerCurrentHeading?: number[];
  currentHeading?: IHeading;
};

export default function ControllersScreen({ params }: any) {
  const [state, setState] = useState<ScreenState>({
    showSpModal: false,
    showLineModal: false,
    showHeadingModal: false,
  });
  const [id, setId] = useState(null);

  useEffect(() => {
    setId(params["id"]);
    let headings: any;

    const setHeading = async () => {
      headings = await Api.getHeadingsForController(id!);
    };
    setHeading();

    setState({ ...state, headings });

    return () => {};
  }, []);

  const saveAndCloseSpModal = () => {
    setState({
      ...state,
      showSpModal: false,
      selectedHeading: undefined,
      currentSp: undefined,
      spsPerCurrentHeading: undefined,
    });
  };

  const saveAndCloseLineModal = () => {
    setState({
      ...state,
      showLineModal: false,
      selectedHeading: undefined,
      currentLine: undefined,
      linesPerCurrentHeading: undefined,
    });
  };

  const saveAndCloseHeadingsModal = () => {
    setState({
      ...state,
      showHeadingModal: false,
      currentHeading: undefined,
    });
  };

  const renderHeadings = () => (
    <Accordion>
      {state.headings?.map((val) => (
        <Card key={val.number}>
          <Card.Header>
            <Row>
              <Col>
                <Accordion.Toggle as={Button} variant="link"
                  eventKey={state.headings!.indexOf(val).toString()}
                >
                  Heading {val.number} {val.description && ` - ${val.description}`}
                </Accordion.Toggle>
              </Col>
              <Col><h4>Weight: <strong>{val.weight}</strong></h4></Col>
              <Col>
                <Button onClick={() => {setState({
                      ...state,
                      showHeadingModal: true,
                      currentHeading: val,
                    });
                  }}
                >Edit</Button>
              </Col>
            </Row>
          </Card.Header>
          <Accordion.Collapse eventKey={state.headings!.indexOf(val).toString()}>
            <Card.Body>
              <Row className="justify-content-md-center">
                <Col>{val.signalPrograms?.length ? (
                  <>
                    <h2>Signal programs</h2>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Program</th>
                          <th>GreenTime</th>
                          <th>
                            <Button onClick={() => setState({
                                  ...state,
                                  showSpModal: true,
                                  selectedHeading: val.number,
                                  spsPerCurrentHeading:
                                    val.signalPrograms?.map((sp) => sp.number),
                                })
                              }
                            >New</Button>
                          </th>
                          </tr>
                        </thead>
                        <tbody>
                          {val.signalPrograms.map((sp) => (
                            <tr key={sp.number}>
                              <td>{sp.number}</td>
                              <td>{sp.greenLength}</td>
                              <td>
                                <Button variant="link" onClick={() => {
                                    setState({
                                      ...state,
                                      showSpModal: true,
                                      selectedHeading: val.number,
                                      currentSp: {
                                        number: sp.number,
                                        greenLength: sp.greenLength,
                                      },
                                    });
                                  }}
                                >Edit</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>{" "}
                    </>
                  ) : (
                    <>
                      <h4>No signal programs set</h4>
                      <Button variant="success"onClick={() => {
                          setState({
                            ...state,
                            showSpModal: true,
                            selectedHeading: val.number,
                            spsPerCurrentHeading: val.signalPrograms?.map(
                              (sp) => sp.number
                            ),
                          });
                        }}
                      >New Signal program</Button>
                    </>
                  )}
                </Col>
                <Col>{val.lines?.length ? (
                    <>
                      <h2>Lines</h2>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Line</th>
                            <th>Saturation</th>
                            <th>
                              <Button onClick={() => {setState({
                                    ...state,
                                    showLineModal: true,
                                    selectedHeading: val.number,
                                    linesPerCurrentHeading: val.lines?.map(
                                      (sp) => sp.number
                                    ),
                                  });
                                }}
                              >New</Button>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {val.lines?.map((l) => (
                            <tr key={l.number}>
                              <td>{l.number}</td>
                              <td>{l.saturation}</td>
                              <td>
                                <Button variant="link" onClick={() => {
                                    setState({
                                      ...state,
                                      showLineModal: true,
                                      selectedHeading: val.number,
                                      currentLine: {
                                        number: l.number,
                                        saturation: l.saturation,
                                      },
                                    });
                                  }}
                                >Edit</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>{" "}
                    </>
                  ) : (
                    <>
                      <h3>No lines set</h3>
                      <Button variant="success" onClick={(_) =>
                          setState({
                            ...state,
                            showLineModal: true,
                            selectedHeading: val.number,
                            linesPerCurrentHeading: val.lines?.map(
                              (sp) => sp.number
                            ),
                          })
                        }
                      >New Line</Button>
                    </>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      ))}
    </Accordion>
  );

  return (
    <>
      <br />
      <Row>
        <Col>
          <h2>Controller {id}</h2>
        </Col>
        <Col>
          <Button variant="success" onClick={() => {
              setState({ ...state, showHeadingModal: true });
            }}
          >New Heading</Button>
        </Col>
      </Row>
      { renderHeadings() }
      {state.showSpModal && (
        <SignalProgramForm
          existingSps={state.spsPerCurrentHeading}
          controller={id!}
          data={state.currentSp}
          heading={state.selectedHeading}
          save={saveAndCloseSpModal}
        />
      )}
      {state.showLineModal && (
        <LineForm
          data={state.currentLine}
          heading={state.selectedHeading}
          controller={id!}
          save={saveAndCloseLineModal}
          existingLines={state.linesPerCurrentHeading}
        />
      )}
      {state.showHeadingModal && (
        <HeadingForm
          data={state.currentHeading}
          controller={id!}
          existingHeadings={state.headings?.map((val) => val.number)}
          hide={saveAndCloseHeadingsModal}
        />
      )}
    </>
  );
}
