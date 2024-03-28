import './App.css';

import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ControllerScreen from './components/ControllerScreen';



import NavBar from './components/NavBar';
import Home from './components/Home';
import Controllers from './components/Controllers';


function App() {  
  return (
    <Router>
      <NavBar />
      <Container fluid>
        <div className="App">
          <Switch>
            <Route exact path="/" component={ () => <Home />} />
            <Route path="/controllers" component={() => <Controllers />} />
            <Route path="/controller/:id" component={() => <ControllerScreen  />} />
          </Switch>
        </div>
      </Container>
    </Router>
  );
}

export default App;
