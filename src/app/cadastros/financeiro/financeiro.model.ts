export class FinanceiroModel {

    public id: number;
    public idEntidade: number;
    public nomeEntidade: string;
    public documento: string;
    public tipoDocumento: string;
    public emissao: Date;
    public vencimento: Date;
    public valor: number;
    public tipo: string;
    public status: string;

    constructor() {

        this.id = 0;
        this.nomeEntidade = '';
        this.idEntidade = 0;
        this.tipoDocumento = '';
        this.documento = '';
        this.emissao = null;
        this.vencimento = null;
        this.valor = 0;
        this.tipo = '';
        this.status = 'Aberto';
    }

}
