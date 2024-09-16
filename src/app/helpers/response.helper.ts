import { PaginationLink } from "@services/pagination.service";

export interface Response {
    success: boolean;
    message?: string;
    result?: any;
}

export const MapResponse = (data: any): Response => {
    console.log(data);
    return {
        success: data.success,
        message: data.message,
        result: data.result,
    };
};

export interface PaginatedResponse<T> {
    currentPage?: number;
    perPage?: number;
    from?: number;
    to?: number;
    total?: number;
    items?: T[],
    links?: PaginationLink[]
}

export const MapPaginatedResponse = <T>(data: any): PaginatedResponse<T> => {
    if (!data.success) {
        return {};
    }

    let response: PaginatedResponse<T> = {};

    if (data.result.currentPage) {
        response.currentPage = data.result.currentPage;
    }

    if (data.result.perPage) {
        response.perPage = data.result.perPage;
    }

    if (data.result.from) {
        response.from = data.result.from;
    }

    if (data.result.to) {
        response.to = data.result.to;
    }

    if (data.result.total) {
        response.total = data.result.total;
    }

    if (data.result.items) {
        response.items = (<T[]>data.result.items);
    }

    if (data.result.links) {
        response.links = (<PaginationLink[]>data.result.links);
    }

    return response;
};
