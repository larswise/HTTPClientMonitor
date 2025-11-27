export interface HttpRequestData {
    Method: string;
    Url: string;
    Authority: string;
    ContentType: string;
    ContentLength: string;
    Version: string;
    RequestedAt: string;
    Headers: { [key: string]: string }
    Response?: HttpResponseData;
    CorrelationId: string;
}

export interface HttpResponseData {
    StatusCode: number;
    ContentType: string;
    ContentLength: string;
    Version: string;
    RespondedAt: string;
    ResponseHeaders: { [key: string]: string }
    CorrelationId: string;
}