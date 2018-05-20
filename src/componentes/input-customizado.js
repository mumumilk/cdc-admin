import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class InputCustomizado extends Component {

    constructor() {
        super();
        this.state = {
            errorMsg: ''
        }
    }

    render() {
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <input id={this.props.id} type={this.props.type} name={this.props.name} value={this.props.value} onChange={this.props.onChange} />
                <span className="error">{this.state.errorMsg}</span>
            </div>
        );
    }

    componentDidMount() {
        PubSub.subscribe('erro-formulario', function(topico, erro) {
            if (erro.field === this.props.name) {
                this.setState({errorMsg: erro.defaultMessage});
            }
        }.bind(this));

        PubSub.subscribe('limpa-erro', function(topico, erro) {
            this.setState({errorMsg: ''});
        }.bind(this));
    }
}