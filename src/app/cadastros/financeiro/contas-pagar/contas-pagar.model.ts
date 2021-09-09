import {FinanceiroModel} from '../financeiro.model';

export class ContasPagarModel extends FinanceiroModel {

    constructor() {
        super();

        this.tipo = 'P';
    }
}
