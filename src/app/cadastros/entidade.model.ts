export abstract class EntidadeModel {

    public id: number;
    public nome: string;
    public sobreNome: string
    public cpfCnpj: string;
    public rg: string;
    public cep: string;
    public endereco: string;
    public estado: string;
    public cidade: string;
    public email: string;
    public cliente: boolean;
    public fornecedor: boolean;
    public usuario: boolean;
    public socio: boolean;
    public observacao: string;

    public dataNascimento: Date;

    constructor() {

        this.id = 0;
        this.nome = '';
        this.sobreNome = '';
        this.cpfCnpj = '';
        this.rg = '';
        this.cep = '';
        this.endereco = '';
        this.estado = '';
        this.cidade = '';
        this.dataNascimento = new Date();
        this.email = '';
        this.cliente = false;
        this.fornecedor = false;
        this.usuario = false;
        this.observacao = '';
        this.socio = false;
    }
}
