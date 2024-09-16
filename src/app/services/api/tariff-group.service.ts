import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MapPaginatedResponse, MapResponse, PaginatedResponse, Response } from '@helpers/response.helper';
import { TariffGroup } from '@models/tariff-group.model';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TariffGroupService {

    constructor(private http: HttpClient) { }

    All(query: string = ''): Observable<PaginatedResponse<TariffGroup>> {
        return this.http.get(`${environment.apiUrl}/tariff-groups${query}`).pipe(
            map((response) => {
                const tariffs: PaginatedResponse<TariffGroup> = MapPaginatedResponse<TariffGroup>(<any>response);
                return tariffs;
            })
        );
    }

    Create(
        suburb: number,
        minSize: number,
        maxSize: number,
        residentialRatesCharge: number,
        residentialRefuseCharge: number,
        residentialSewerageCharge: number,
        commercialRatesCharge: number,
        commercialRefuseCharge: number,
        commercialSewerageCharge: number,
    ): Observable<TariffGroup> {
        return this.http.post(`${environment.apiUrl}/tariff-groups`, {
            suburb_id: suburb,
            min_size: minSize,
            max_size: maxSize,
            residential_rates_charge: residentialRatesCharge,
            residential_refuse_charge: residentialRefuseCharge,
            residential_sewerage_charge: residentialSewerageCharge,
            commercial_rates_charge: commercialRatesCharge,
            commercial_refuse_charge: commercialRefuseCharge,
            commercial_sewerage_charge: commercialSewerageCharge,
        }).pipe(
            map((response) => {
                const tariff: TariffGroup = (<any>response).result;
                return tariff;
            })
        );
    }

    Update(
        id: number,
        minSize: number,
        maxSize: number,
        residentialRatesCharge: number,
        residentialRefuseCharge: number,
        residentialSewerageCharge: number,
        commercialRatesCharge: number,
        commercialRefuseCharge: number,
        commercialSewerageCharge: number,
    ): Observable<TariffGroup> {
        return this.http.put(`${environment.apiUrl}/tariff-groups/${id}`, {
            min_size: minSize,
            max_size: maxSize,
            residential_rates_charge: residentialRatesCharge,
            residential_refuse_charge: residentialRefuseCharge,
            residential_sewerage_charge: residentialSewerageCharge,
            commercial_rates_charge: commercialRatesCharge,
            commercial_refuse_charge: commercialRefuseCharge,
            commercial_sewerage_charge: commercialSewerageCharge,
        }).pipe(
            map((response) => {
                const tariff: TariffGroup = (<any>response).result;
                return tariff;
            })
        );
    }

    Delete(id: number): Observable<Response> {
        return this.http.delete(`${environment.apiUrl}/tariff-groups/${id}`).pipe(
            map((response) => {
                const result: Response = MapResponse(<any>response);
                return result;
            })
        );
    }
}
