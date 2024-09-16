import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginatedResponse } from '@helpers/response.helper';
import { Activity } from '@models/activity.model';
import { DashboardService } from '@services/api/dashboard.service';
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexFill,
    ApexYAxis,
    ApexTooltip,
    ApexMarkers,
    ApexGrid,
    ApexDataLabels,
    ApexXAxis,
    ApexPlotOptions,
    NgApexchartsModule,
    ApexStroke,
    ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    stroke: ApexStroke;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    grid: ApexGrid;
    tooltip: ApexTooltip;
    colors: string[];
    fill: ApexFill;
    legend: ApexLegend;
};

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [NgApexchartsModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    public propertyCount: string;
    public balances: string;
    public activities: PaginatedResponse<Activity>;
    public activeLog: Activity;

    constructor(private dashboardService: DashboardService) {
        this.chartOptions = {
            series: [
                {
                    name: "Paid",
                    data: [1.5, 2.7, 2.2, 3.6, 1.5, 1.0],
                },
                {
                    name: "Arrears",
                    data: [-1.8, -1.1, -2.5, -1.5, -0.6, -1.8],
                },
            ],
            chart: {
                toolbar: {
                    show: false,
                },
                type: "bar",
                fontFamily: "inherit",
                foreColor: "#adb0bb",
                height: 310,
                stacked: true,
            },
            colors: ["#5d87ff", "var(--bs-secondary)"],
            plotOptions: {
                bar: {
                    horizontal: false,
                    barHeight: "60%",
                    columnWidth: "20%",
                    borderRadius: 6,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "all",
                },
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: false,
            },
            grid: {
                borderColor: "rgba(0,0,0,0.1)",
                strokeDashArray: 3,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            yaxis: {
                tickAmount: 4,
                min: -5,
                max: 5,
                title: {
                    //text: 'Age',
                },
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                categories: [
                    "16/08",
                    "17/08",
                    "18/08",
                    "19/08",
                    "20/08",
                    "21/08",
                    "22/08",
                ],
            },
            tooltip: {
                theme: "dark",
            },
        };
    }

    public generateData(count, yrange) {
        var i = 0;
        var series = [];
        while (i < count) {
            var x = "w" + (i + 1).toString();
            var y =
                Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

            series.push({
                x: x,
                y: y
            });
            i++;
        }
        return series;
    }

    ngOnInit(): void {
        this.dashboardService.Properties().subscribe((data) => {
            this.propertyCount = data.result;
        });

        this.dashboardService.Balances().subscribe((data) => {
            this.balances = data.result;
        });

        this.dashboardService.Activities().subscribe((data) => {
            this.activities = data;
        });
    }

    getObjectEntries(code: string) {
        if (code == null) return null;
        const detail: Object = JSON.parse(code);
        return Object.entries(detail);
    }
}
