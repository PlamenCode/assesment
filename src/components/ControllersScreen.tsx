import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import IHeading from "../interfaces/IHeading";
import IHeadingResponse from "../interfaces/IHeadingResponse";
import ILine from "../interfaces/ILine";
import ISignalProgram from "../interfaces/ISignalProgram";
import TracApi from "../services/trac-api";
import HeadingForm from "./forms/HeadingForm";
import LineForm from "./forms/LineForm";
import SignalProgramForm from "./forms/SignalProgramForm";
import { useParams } from "react-router-dom";

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


export default function ControllersScreen() {
	const [state, setState] = useState<ScreenState>({
		showSpModal: false,
		showLineModal: false,
		showHeadingModal: false,
	});
	const [id, setId] = useState<number>();
	const params = useParams<{id: string}>();

	useEffect(() => {
		let headings: any;
		setId(Number(params.id));
			
		const setHeading = async () => {
			headings = await Api.getHeadingsForController(Number(params.id));	
			return headings;
		};
		setHeading()
			.then(res => res)
			.then(data => {
				setState({ ...state, headings: data });
			});		
	}, []);

	const saveAndCloseSpModal = () => {
		setState({
			...state,
			showSpModal: false,
			selectedHeading: undefined,
			currentSp: undefined,
			spsPerCurrentHeading: undefined,
		});
		window.location.reload();
	};

	const saveAndCloseLineModal = () => {
		setState({
			...state,
			showLineModal: false,
			selectedHeading: undefined,
			currentLine: undefined,
			linesPerCurrentHeading: undefined,
		});
		window.location.reload();
	};

	const saveAndCloseHeadingsModal = () => {
		setState({
			...state,
			showHeadingModal: false,
			currentHeading: undefined,
		});
		window.location.reload();
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
								>Heading {val.number} {val.description && ` - ${val.description}`}
								</Accordion.Toggle>
							</Col>
							<Col><h4>Weight: <strong>{val.weight}</strong></h4></Col>
							<Col>
								<Button onClick={() => {
									setState({
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
										<Button variant="success" onClick={() => {
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
														<Button onClick={() => {
															setState({
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
			{ !state.headings || state.headings.length < 1 && <h1>No headings yet.</h1> }
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
					{/* buttons for forms */}
					<Button variant="success" onClick={() => {
						setState({ ...state, showHeadingModal: true });
					}}
					>New Heading</Button>

					<Button variant="success" onClick={() => {
						setState({ ...state, showLineModal: true });
					}}
					>New Line</Button>

					<Button variant="success" onClick={() => {
						setState({ ...state, showSpModal: true });
					}}
					>New Signal</Button>
				</Col>
			</Row>
			{renderHeadings()}
			{state.showSpModal && (
				<SignalProgramForm
					existingSps={state.spsPerCurrentHeading}
					controller={id!}
					data={state.currentSp}
					heading={state.selectedHeading}
					save={saveAndCloseSpModal}
				/>
			)}
			{/* <SignalProgramForm
					existingSps={state.spsPerCurrentHeading}
					controller={id!}
					data={state.currentSp}
					heading={state.selectedHeading}
					save={saveAndCloseSpModal}
			/> */}
			{/* internal serverr error on submit the SignalProgramForm */}
			{state.showLineModal && (
				<LineForm
					data={state.currentLine}
					heading={state.selectedHeading}
					controller={id!}
					save={saveAndCloseLineModal}
					existingLines={state.linesPerCurrentHeading}
				/>
			)}
			{/* <LineForm
					data={state.currentLine}
					heading={state.selectedHeading}
					controller={id!}
					save={saveAndCloseLineModal}
					existingLines={state.linesPerCurrentHeading}
			/>  */}
			{/* internal serverr error on submit the LineForm  */}
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
