import React, { Component } from 'react';
import * as $ from 'jquery';
import PubSub from 'pubsub-js';
import InputCustomizado from './componentes/input-customizado';
import ButtonCustomizado from './componentes/button-customizado';
import TratadorErros from './TratadorErros';

export class FormularioLivro extends Component {
    constructor() {
        super();

        this.state = {
            titulo: '',
            preco: '',
            autor: {}
        }

        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutor = this.setAutor.bind(this);
    }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/livros',
            dataType: 'json',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ titulo: this.state.titulo, preco: this.state.preco, autor: this.state.autor }),
            success: function (retorno) {
                PubSub.publish('atualiza-lista-autores', retorno);
                this.setState({ titulo: '', preco: '', autor: {} });
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

    setTitulo(evento) {
        this.setState({ titulo: evento.target.titulo });
    }
    setPreco(evento) {
        this.setState({ preco: evento.target.preco });
    }
    setAutor(evento) {
        this.setState({ autor: evento.target.autor });
    }


    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" method="post" onSubmit={this.enviaForm}>
                    <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Titulo" />
                    <InputCustomizado id="preco" type="number" name="preco" value={this.state.preco} onChange={this.setPreco} label="Preco" />
                    <div class="form-group">
                        <label for="exampleFormControlSelect1">Example select</label>
                        <select class="form-control" id="exampleFormControlSelect1">
                        {this.props.lista.forea}
                        </select>
                    </div>
                    {/* <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha" /> */}
                    <ButtonCustomizado type="submit" label="Gravar" />
                </form>
            </div>
        );
    }
}

export class TabelaLivros extends Component {
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
                            <th>Titulo {this.getTamanhoDaLista()}</th>
                            <th>Preco</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map((a) => {
                                return (<tr key={a.id}><td>{a.titulo}</td><td>{a.preco}</td><td>{a.autor.nome}</td></tr>);
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default class LivroBox extends Component {
    constructor() {
        super();
        this.state = {
            lista: []
        }
    }

    componentDidMount() {
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/livros',
            dataType: 'json',
            success: function (resposta) {
                this.setState({ lista: resposta });
            }.bind(this)
        });
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro />
                    <TabelaLivros lista={this.state.lista} />
                </div>
            </div>
        );
    }
}