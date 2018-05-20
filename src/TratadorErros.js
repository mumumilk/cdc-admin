import PubSub from 'pubsub-js';

export default class TratadorErros {
    publicaErros(erros) {
        for (let index = 0; index < erros.errors.length; index++) {
            PubSub.publish('erro-formulario', erros.errors[index]);
        }
    }
}