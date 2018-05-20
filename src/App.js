import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css';
import Home from './Home';
import AutorBox from './Autor';
import { Route, Switch, Link} from 'react-router-dom';
import LivroBox from './Livro';

class App extends Component {


  render() {
    return (

      <div id="layout">
        <a href="#menu" id="menuLink" className="menu-link">
          <span></span>
        </a>

        <div id="menu">
          <div className="pure-menu">
            <a className="pure-menu-heading">Company</a>

            <ul className="pure-menu-list">
              <li className="pure-menu-item"><Link to="/" className="pure-menu-link">Home</Link></li>
              <li className="pure-menu-item"><Link to="/autor" className="pure-menu-link">Autor</Link></li>
              <li className="pure-menu-item"><Link to="/livro" className="pure-menu-link">Livros</Link></li>
            </ul>
          </div>
        </div>

        <div id="main">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/autor" component={AutorBox} />
            <Route path="/livro" component={LivroBox}/>
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
