import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/input-customizado';
import ButtonCustomizado from './componentes/button-customizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

export class FormularioAutor extends Component {
    constructor() {
        super();

        this.state = {
            nome: '',
            email: '',
            senha: ''
        }

        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            dataType: 'json',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
            success: function (retorno) {
                PubSub.publish('atualiza-lista-autores', retorno);
                this.setState({ nome: '', email: '', senha: '' });
            }.bind(this),
            error: function (resposta) {
                if (resposta.status === 400) {
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            },
            beforeSend: function () {
                PubSub.publish('limpa-erro', {});
            }
        });
    }

    setNome(evento) {
        this.setState({ nome: evento.target.value });
    }
    setEmail(evento) {
        this.setState({ email: evento.target.value });
    }
    setSenha(evento) {
        this.setState({ senha: evento.target.value });
    }


    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" method="post" onSubmit={this.enviaForm}>
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome" />
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="E-mail" />
                    <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha" />
                    <ButtonCustomizado type="submit" label="Gravar" />
                </form>
            </div>
        );
    }
}

export class TabelaAutores extends Component {

    constructor() {
        super();

        this.state = {
            lista: []
        }


        this.getTamanhoDaLista = this.getTamanhoDaLista.bind(this);
    }


    getTamanhoDaLista() {
        return this.props.lista.length;
    }

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome {this.getTamanhoDaLista()}</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map((a) => {
                                return (<tr key={a.id}><td>{a.nome}</td><td>{a.email}</td></tr>);
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = {
            lista: []
        }
    }

    componentDidMount() {
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            dataType: 'json',
            success: function (resposta) {
                this.setState({ lista: resposta });
            }.bind(this)
        });

        PubSub.subscribe('atualiza-lista-autores', function (topico, novaLista) {
            this.setState({ lista: novaLista });
        }.bind(this));
    }


    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Autores</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor />
                    <TabelaAutores lista={this.state.lista} />
                </div>
            </div>
        );
    }
}