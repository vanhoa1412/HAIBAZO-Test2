package com.haibazo.bookreviews.service;

import com.haibazo.bookreviews.dto.PageResponse;
import com.haibazo.bookreviews.dto.ReviewDTO;
import com.haibazo.bookreviews.model.Book;
import com.haibazo.bookreviews.model.Review;
import com.haibazo.bookreviews.repository.BookRepository;
import com.haibazo.bookreviews.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;

    public PageResponse<ReviewDTO> getAllReviews(int page, int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<Review> reviews = reviewRepository.findAll(pageable);

        List<ReviewDTO> items = reviews.getContent().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        PageResponse.PageMeta meta = PageResponse.PageMeta.builder()
                .currentPage(page)
                .pageSize(pageSize)
                .totalPages(reviews.getTotalPages())
                .totalItems(reviews.getTotalElements())
                .hasNextPage(reviews.hasNext())
                .hasPrevPage(reviews.hasPrevious())
                .build();

        return PageResponse.<ReviewDTO>builder()
                .items(items)
                .meta(meta)
                .build();
    }

    public ReviewDTO getReviewById(Long id) {
        return reviewRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Review not found"));
    }

    public ReviewDTO createReview(ReviewDTO dto) {
        Book book = bookRepository.findById(dto.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Review review = Review.builder()
                .book(book)
                .review(dto.getReview())
                .build();
        Review saved = reviewRepository.save(review);
        return toDTO(saved);
    }

    public ReviewDTO updateReview(Long id, ReviewDTO dto) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setReview(dto.getReview());

        if (dto.getBookId() != null && !dto.getBookId().equals(review.getBook().getId())) {
            Book book = bookRepository.findById(dto.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));
            review.setBook(book);
        }

        Review updated = reviewRepository.save(review);
        return toDTO(updated);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    private ReviewDTO toDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .bookId(review.getBook().getId())
                .review(review.getReview())
                .bookTitle(review.getBook().getTitle())
                .authorName(review.getBook().getAuthor().getName())
                .build();
    }
}
