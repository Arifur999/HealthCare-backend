export interface PrismaFindManyArgs {
    where ?: Record<string, unknown>;
    include ?: Record<string, unknown>;
    select ?: Record<string, boolean | Record<string, unknown> >
    orderBy ?: Record<string, unknown> | Record<string, unknown>[];
    skip ?: number;
    take ?: number;
    cursor ?: Record<string, unknown>;
    distinct ?: string[] | string;
    [key: string] : unknown;
}

export interface PrismaCountArgs {
    where?: Record<string, unknown>;
    include?: Record<string, unknown>;
    select?: Record<string, boolean | Record<string, unknown>>
    orderBy?: Record<string, unknown> | Record<string, unknown>[];
    skip?: number;
    take?: number;
    cursor?: Record<string, unknown>;
    distinct?: string[] | string;
    [key: string]: unknown;
}

export interface PrismaModelDelegate{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findMany(args?:any): Promise<any[]>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    count(args?:any): Promise<number>;
}

export interface IqueryParams {
    searchTerm?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    fields?: string;
    include?: string;
    exclude?: string;
    [key: string]: string | undefined;
}

