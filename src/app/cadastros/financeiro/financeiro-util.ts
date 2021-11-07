import {TipoFiltroFinanceiro} from '../../enuns/tipo-filtro-financeiro';

export class FinanceiroUtil {

    public static getUrl(params, isReceber: boolean = true): string {
        let tipoFiltro = params['tipoFiltro'];
        if (tipoFiltro) {
            tipoFiltro = Number.parseInt(tipoFiltro);
        }

        switch (tipoFiltro) {
            case TipoFiltroFinanceiro.RECEBER_VENCIDO:
                return 'receber-vencido';
            case TipoFiltroFinanceiro.RECEBER_VENCENDO:
                return 'receber-vencendo';
            case TipoFiltroFinanceiro.PAGAR_VENCIDO:
                return 'pagar-vencido';
            case TipoFiltroFinanceiro.PAGAR_VENCENDO:
                return 'pagar-vencendo';
            default:
                if (isReceber) {
                    return 'listreceber';
                } else {
                    return 'listpagar';
                }

        }
    }

}
