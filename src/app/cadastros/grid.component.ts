import {FormComponent} from './form.component';
import {MatPaginatorIntl} from '@angular/material/paginator';


export class GridComponent extends FormComponent {

    public paginas = [20, 35, 50];


    constructor(public mat: MatPaginatorIntl) {
        super();

        mat.lastPageLabel = 'Última';
        mat.nextPageLabel = 'Próxima';
        mat.firstPageLabel = 'Primeira';
        mat.previousPageLabel = 'Voltar';
        mat.itemsPerPageLabel = 'Itens por página';
        mat.getRangeLabel = (page: number, pageSize: number, length: number): string => {
            const of = 'de';
            if (length === 0 || pageSize === 0) {
                return '0 ' + of + ' ' + length;
            }
            length = Math.max(length, 0);
            const startIndex = ((page * pageSize) > length) ? (Math.ceil(length / pageSize) - 1) * pageSize : page * pageSize;

            const endIndex = Math.min(startIndex + pageSize, length);
            return endIndex + ' ' + of + ' ' + length;
        };
    }

}
