export class DashboardCaixa {

    public receber: Map<number, number>;
    public pagar: Map<number, number>;
    public saldo: Map<number, number>;


    constructor() {
        this.receber = new Map<number, number>();
        this.pagar = new Map<number, number>();
        this.saldo = new Map<number, number>();
    }
}
