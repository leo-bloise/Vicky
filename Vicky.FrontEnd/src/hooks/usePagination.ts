import { useCallback, useState } from "react";

type PaginationState<T> = {
    currentPage: number,
    totalPages: number,
    pageSize: number,
    data: T[],
    isLoading: boolean
};

type PageProviderResponse<T> = {
    currentPage: number,
    totalPages: number,
    pageSize: number,
    data: T[]
};

type PageProvider<T> = (pageNumber: number, pageSize: number) => Promise<PageProviderResponse<T>>;

export default function usePagination<T>(initPagination: Omit<PaginationState<T>, 'isLoading'>, pageProviderFunc: PageProvider<T>) {
    const [currentState, setState] = useState<PaginationState<T>>({
        ...initPagination,
        isLoading: false
    });

    const { currentPage, totalPages, pageSize, isLoading } = currentState;

    const hasNext = currentPage < totalPages;
    const hasPrevious = currentPage > 1;

    const fetchPage = useCallback(async (page: number, currentSize: number = pageSize) => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const result = await pageProviderFunc(page, currentSize);
            setState({
                currentPage: result.currentPage,
                data: result.data,
                pageSize: result.pageSize,
                totalPages: result.totalPages,
                isLoading: false
            });
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    }, [pageProviderFunc, pageSize]);

    const loadPage = useCallback(() => {
        fetchPage(currentPage);
    }, [fetchPage, currentPage]);

    const handleNext = useCallback(() => {
        if (hasNext && !isLoading) {
            fetchPage(currentPage + 1);
        }
    }, [hasNext, isLoading, currentPage, fetchPage]);

    const handlePrevious = useCallback(() => {
        if (hasPrevious && !isLoading) {
            fetchPage(currentPage - 1);
        }
    }, [hasPrevious, isLoading, currentPage, fetchPage]);

    const setPageSize = useCallback((newPageSize: number) => {
        fetchPage(1, newPageSize);
    }, [fetchPage]);

    return {
        currentPage,
        totalPages,
        pageSize,
        data: currentState.data,
        hasNext,
        hasPrevious,
        handleNext,
        handlePrevious,
        loadPage,
        setPageSize,
        isLoading
    }
}
