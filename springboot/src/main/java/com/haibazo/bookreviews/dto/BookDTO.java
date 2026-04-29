package com.haibazo.bookreviews.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDTO {
    private Long id;

    @NotBlank(message = "Book title is required")
    private String title;

    @NotNull(message = "Author ID is required")
    private Long authorId;

    private String authorName;

    private Integer reviewsCount;
}
