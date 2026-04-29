package com.haibazo.bookreviews.service;

import com.haibazo.bookreviews.dto.BookDTO;
import com.haibazo.bookreviews.dto.PageResponse;
import com.haibazo.bookreviews.model.Author;
import com.haibazo.bookreviews.model.Book;
import com.haibazo.bookreviews.repository.AuthorRepository;
import com.haibazo.bookreviews.repository.BookRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    public PageResponse<BookDTO> getAllBooks(int page, int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<Book> books = bookRepository.findAll(pageable);

        List<BookDTO> items = books.getContent().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        PageResponse.PageMeta meta = PageResponse.PageMeta.builder()
                .currentPage(page)
                .pageSize(pageSize)
                .totalPages(books.getTotalPages())
                .totalItems(books.getTotalElements())
                .hasNextPage(books.hasNext())
                .hasPrevPage(books.hasPrevious())
                .build();

        return PageResponse.<BookDTO>builder()
                .items(items)
                .meta(meta)
                .build();
    }

    public BookDTO getBookById(Long id) {
        return bookRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }

    public BookDTO createBook(BookDTO dto) {
        Author author = authorRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found"));

        Book book = Book.builder()
                .title(dto.getTitle())
                .author(author)
                .build();
        Book saved = bookRepository.save(book);
        return toDTO(saved);
    }

    public BookDTO updateBook(Long id, BookDTO dto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setTitle(dto.getTitle());

        if (dto.getAuthorId() != null && !dto.getAuthorId().equals(book.getAuthor().getId())) {
            Author author = authorRepository.findById(dto.getAuthorId())
                    .orElseThrow(() -> new RuntimeException("Author not found"));
            book.setAuthor(author);
        }

        Book updated = bookRepository.save(book);
        return toDTO(updated);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    private BookDTO toDTO(Book book) {
        return BookDTO.builder()
                .id(book.getId())
                .title(book.getTitle())
                .authorId(book.getAuthor().getId())
                .authorName(book.getAuthor().getName())
                .reviewsCount(book.getReviews() != null ? book.getReviews().size() : 0)
                .build();
    }
}
