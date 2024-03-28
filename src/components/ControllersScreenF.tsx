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

export default function ControllersScreenF() {
    

  return (
    <div>ControllersScreenF</div>
  )
}
