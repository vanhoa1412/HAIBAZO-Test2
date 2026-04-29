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
public class ReviewDTO {
    private Long id;

    @NotNull(message = "Book ID is required")
    private Long bookId;

    @NotBlank(message = "Review content is required")
    private String review;

    private String bookTitle;

    private String authorName;
}
