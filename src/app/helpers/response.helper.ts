export interface Response {
    success: boolean;
    message?: string;
    result?: any;
}

export const MapResponse = (data: any): Response => {
    return {
        success: data.success,
        message: data.message,
        result: data.result,
    };
};
