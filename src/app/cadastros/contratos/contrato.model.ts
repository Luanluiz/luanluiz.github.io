export class ContratoModel {

    public id: number;
    public idEntidade: number;
    public nomeEntidade: string;
    public dataInicio: Date;
    public tempo: number;
    public valor: number;
    public diaVencimento: number;

    constructor() {

        this.id = 0;
        this.idEntidade = 0;
        this.nomeEntidade = '';
        this.dataInicio = new Date();
        this.tempo = 0;
        this.valor = 0;
        this.diaVencimento = 10;

    }
}
