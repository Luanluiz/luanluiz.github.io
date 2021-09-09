export class UsuarioModel {

    public id: number;
    public nome: string;
    public idEntidade: number;
    public entidade: string;
    public usuario: string;
    public senha: string;
    public email: string;

    constructor() {

        this.id = 0;
        this.nome = '';
        this.idEntidade = 0;
        this.entidade = '';
        this.usuario = '';
        this.senha = '';
        this.email = '';
    }
}
