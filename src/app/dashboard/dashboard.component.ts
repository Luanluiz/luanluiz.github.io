import {Component, OnInit} from '@angular/core';
import * as Chartist from 'chartist';
import {FormComponent} from '../cadastros/form.component';
import {HttpClient} from '@angular/common/http';
import {LINK} from '../cadastros/clientes/cliente.grid.component';
import {DadosDashboardModel} from './dadosDashboard.model';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {TipoFiltroFinanceiro} from '../enuns/tipo-filtro-financeiro';
import {TipoFinanceiro} from '../enuns/tipo-financeiro';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends FormComponent implements OnInit {

    public receberVencido$: BehaviorSubject<number>;
    public receberVencendo$: BehaviorSubject<number>;
    public pagarVencido$: BehaviorSubject<number>;
    public pagarVencendo$: BehaviorSubject<number>;
    public totalSocios$: BehaviorSubject<number>;


    // public barChartOptions: ChartOptions = {
    //     responsive: true,
    //     // We use these empty structures as placeholders for dynamic theming.
    //     scales: { xAxes: [{}], yAxes: [{}]},
    //     plugins: {
    //         datalabels: {
    //             anchor: 'end',
    //             align: 'end',
    //         }
    //     }
    // };
    // public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    // public barChartType: ChartType = 'bar';
    // public barChartLegend = true;
    // public barChartPlugins = [pluginDataLabels];
    //
    // public barChartData: ChartDataSets[] = [
    //     {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    //     {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
    // ];

    constructor(private http: HttpClient, private router: Router) {
        super();

        this.receberVencido$ = new BehaviorSubject<number>(0.00);
        this.receberVencendo$ = new BehaviorSubject<number>(0.00);
        this.pagarVencendo$ = new BehaviorSubject<number>(0.00);
        this.pagarVencido$ = new BehaviorSubject<number>(0.00);
        this.totalSocios$ = new BehaviorSubject<number>(0);
    }

    startAnimationForLineChart(chart) {
        let seq: any, delays: any, durations: any;
        seq = 0;
        delays = 80;
        durations = 500;

        chart.on('draw', function (data) {
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 600,
                        dur: 700,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                    }
                });
            } else if (data.type === 'point') {
                seq++;
                data.element.animate({
                    opacity: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });

        seq = 0;
    };

    startAnimationForBarChart(chart) {
        let seq2: any, delays2: any, durations2: any;

        seq2 = 0;
        delays2 = 80;
        durations2 = 500;
        chart.on('draw', function (data) {
            if (data.type === 'bar') {
                seq2++;
                data.element.animate({
                    opacity: {
                        begin: seq2 * delays2,
                        dur: durations2,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });

        seq2 = 0;
    };

    ngOnInit() {

        this.carregarDados()
        this.carregarTotalSocio();

        /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

        const dataDailySalesChart: any = {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            series: [
                [12, 40, 7, 17, 23, 18, 38]
            ]
        };

        const optionsDailySalesChart: any = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
        }

        const dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

        this.startAnimationForLineChart(dailySalesChart);


        /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

        const dataCompletedTasksChart: any = {
            labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
            series: [
                [230, 750, 450, 300, 280, 240, 200, 190]
            ]
        };

        const optionsCompletedTasksChart: any = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {top: 0, right: 0, bottom: 0, left: 0}
        }

        const completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

        // start animation for the Completed Tasks Chart - Line Chart
        this.startAnimationForLineChart(completedTasksChart);


        /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

        const datawebsiteViewsChart = {
            labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
            series: [
                [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 950]

            ]
        };
        const optionswebsiteViewsChart = {
            axisX: {
                showGrid: false
            },
            low: 0,
            // high: 1600,
            chartPadding: {top: 0, right: 0, bottom: 0, left: 0}
        };
        const responsiveOptions: any[] = [
            ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function (value) {
                        return value[0];
                    }
                }
            }]
        ];

        const websiteViewsChart =
            new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

        // start animation for the Emails Subscription Chart
        this.startAnimationForBarChart(websiteViewsChart);
    }

    public acessarVencidoReceber() {
        this.acessarReceber(TipoFiltroFinanceiro.RECEBER_VENCIDO, TipoFinanceiro.RECEBER);
    }

    public acessarVencendoReceber() {
        this.acessarReceber(TipoFiltroFinanceiro.RECEBER_VENCENDO, TipoFinanceiro.RECEBER);
    }

    public acessarVencidoPagar() {
        this.acessarReceber(TipoFiltroFinanceiro.PAGAR_VENCIDO, TipoFinanceiro.PAGAR);
    }

    public acessarVencendoPagar() {
        this.acessarReceber(TipoFiltroFinanceiro.PAGAR_VENCENDO, TipoFinanceiro.PAGAR);
    }

    public carregarSocios() {
        const param = {socio: 1};
        this.router.navigate([`/cadastros/clientes`], {queryParams: param});
    }

    private carregarDados() {
        this.addSubscription(this.http.get(`${LINK}financeiro/dashboard`)
            .pipe(
                map((dados: DadosDashboardModel) => (dados)),
            )
            .subscribe((dados) => {

                this.receberVencido$.next(dados.valorReceberVencido);
                this.receberVencendo$.next(dados.valorReceberVencendo);
                this.pagarVencido$.next(dados.valorPagarVencido);
                this.pagarVencendo$.next(dados.valorPagarVencendo);

            }))
    }

    private carregarTotalSocio() {
        this.addSubscription(this.http.get(`${LINK}entidades/total-socio`)
            .pipe(
                map((total: number) => (total)),
            )
            .subscribe(this.totalSocios$));
    }

    private acessarReceber(tipoFiltro: TipoFiltroFinanceiro, tipoFinanceiro: TipoFinanceiro) {
        let url;
        if (tipoFinanceiro === TipoFinanceiro.RECEBER) {
            url = `/cadastros/contas-receber/`;
        } else {
            url = `/cadastros/contas-pagar/`;
        }
        const param = {tipoFiltro: tipoFiltro};
        this.router.navigate([url], {queryParams: param});
    }

    // events
    // public chartClicked({event, active}: { event: MouseEvent, active: {}[] }): void {
    //     console.log(event, active);
    // }
    //
    // public chartHovered({event, active}: { event: MouseEvent, active: {}[] }): void {
    //     console.log(event, active);
    // }
    //
    // public randomize(): void {
    //     // Only Change 3 values
    //     this.barChartData[0].data = [
    //         Math.round(Math.random() * 100),
    //         59,
    //         80,
    //         (Math.random() * 100),
    //         56,
    //         (Math.random() * 100),
    //         40];
    // }
}
