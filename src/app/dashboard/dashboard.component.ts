import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {Chart} from 'chart.js';
import {DashboardCaixa} from './dashboard-caixa';

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
    public saldo$: BehaviorSubject<number>;


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

    @ViewChild('bar', {static: true}) public elementBar: ElementRef
    @ViewChild('line', {static: true}) public elementLine: ElementRef

    constructor(private http: HttpClient, private router: Router) {
        super();

        this.receberVencido$ = new BehaviorSubject<number>(0.00);
        this.receberVencendo$ = new BehaviorSubject<number>(0.00);
        this.pagarVencendo$ = new BehaviorSubject<number>(0.00);
        this.pagarVencido$ = new BehaviorSubject<number>(0.00);
        this.totalSocios$ = new BehaviorSubject<number>(0);
        this.saldo$ = new BehaviorSubject<number>(0);
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


        this.addSubscription(this.http.get(`${LINK}caixa/dashboard-caixa`)
            .pipe(
                map((dados: DashboardCaixa) => (dados)),
            )
            .subscribe((dados) => {


                    const i = new Chart(this.elementBar.nativeElement, {
                        type: 'bar',
                        data: {
                            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                            datasets: [
                                {
                                    label: 'Entrada',
                                    data: [dados.receber[1], dados.receber[2], dados.receber[3], dados.receber[4], dados.receber[5],
                                        dados.receber[6], dados.receber[7], dados.receber[8], dados.receber[9], dados.receber[10],
                                        dados.receber[11], dados.receber[12], dados.receber[13]],
                                    backgroundColor: 'rgb(75,175,80,0.7)',
                                },
                                {
                                    label: 'Saída',
                                    data: [dados.pagar[1], dados.pagar[2], dados.pagar[3], dados.pagar[4], dados.pagar[5],
                                        dados.pagar[6], dados.pagar[7], dados.pagar[8], dados.pagar[9], dados.pagar[10],
                                        dados.pagar[11], dados.pagar[12], dados.pagar[13]],
                                    backgroundColor: 'rgb(244,67,54,0.7)',
                                }
                            ]
                        },

                        options: {
                            scales: {
                                x: {
                                    grid: {
                                        display: false,
                                    }
                                }
                            }

                        }

                    });

                    const line = new Chart(this.elementLine.nativeElement, {
                        type: 'line',
                        data: {
                            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                            datasets: [
                                {
                                    // label: 'Saldo em caixa',
                                    data: [dados.saldo[1], dados.saldo[2], dados.saldo[3], dados.saldo[4], dados.saldo[5],
                                        dados.saldo[6], dados.saldo[7], dados.saldo[8], dados.saldo[9], dados.saldo[10],
                                        dados.saldo[11], dados.saldo[12], dados.saldo[13]],
                                    backgroundColor: 'rgb(75,175,80)',
                                },
                            ]
                        },

                        options: {

                           plugins: {
                               legend: {
                                   display: false,
                               }
                           },

                            scales: {
                                x: {
                                    grid: {
                                        display: false,
                                    }
                                }
                            }

                        }

                    });
                }
            )
        );


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
            title: 'Teste',
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
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            series: [
                [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 950],
                [300, 200, 520, 150, 120, 453, 326, 434, 568, 610, 756, 950],
                // [300, 200, 520, 150, 120, 453, 326, 434, 568, 610, 756, 950],
            ],


        };
        const optionswebsiteViewsChart = {
            axisX: {
                showGrid: false
            },
            low: 0,
            // high: 1600,
            chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
            // seriesBarDistance: 10,
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
        // this.startAnimationForBarChart(websiteViewsChart);
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

    public acessarCaxia() {
        this.router.navigate([`/cadastros/caixa`]);
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

        this.http.get(`${LINK}caixa/saldo`)
            .pipe(
                map((saldo: number) => saldo)
            )
            .subscribe(this.saldo$);
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
