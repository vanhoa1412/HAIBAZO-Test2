package com.haibazo.bookreviews.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageResponse<T> {
    private List<T> items;
    private PageMeta meta;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PageMeta {
        private Integer currentPage;
        private Integer pageSize;
        private Integer totalPages;
        private Long totalItems;
        private Boolean hasNextPage;
        private Boolean hasPrevPage;
    }
}
