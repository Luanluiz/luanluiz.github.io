export class BaixaFinanceiroModel {
    public id: number;
    public meioPagamento: string;
    public valor: number;
    public idFinanceiro: number;

    constructor() {
        this.id = 0;
        this.meioPagamento = '';
        this.valor = 0;
        this.idFinanceiro = 0;
    }
}
