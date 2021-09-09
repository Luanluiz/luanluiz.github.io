export class BaixaFinanceiroModel {
    public id: number;
    public formaPagamento: string;
    public valor: number;
    public idFinanceiro: number;

    constructor() {
        this.id = 0;
        this.formaPagamento = '';
        this.valor = 0;
        this.idFinanceiro = 0;
    }
}
