import {TipoMovimentoCaixaEnum} from './tipo-movimento-caixa.enum';

export class CaixaModel {

    public id: number;
    public tipoMovimento: TipoMovimentoCaixaEnum;
    public entrada: number;
    public saida: number;
    public idBaixa: number;
    public data: Date;
    public historico: string;
    public meioPagamento: string;

    constructor() {

        this.id = 0;
        this.tipoMovimento = TipoMovimentoCaixaEnum.SAIDA;
        this.entrada = 0;
        this.saida = 0;
        this.idBaixa = 0;
        this.data = new Date();
        this.historico = '';
        this.meioPagamento = '';
    }
}
