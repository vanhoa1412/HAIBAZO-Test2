package com.haibazo.bookreviews.service;

import com.haibazo.bookreviews.dto.AuthorDTO;
import com.haibazo.bookreviews.dto.PageResponse;
import com.haibazo.bookreviews.model.Author;
import com.haibazo.bookreviews.repository.AuthorRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AuthorService {
    private final AuthorRepository authorRepository;

    public PageResponse<AuthorDTO> getAllAuthors(int page, int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<Author> authors = authorRepository.findAll(pageable);

        List<AuthorDTO> items = authors.getContent().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        PageResponse.PageMeta meta = PageResponse.PageMeta.builder()
                .currentPage(page)
                .pageSize(pageSize)
                .totalPages(authors.getTotalPages())
                .totalItems(authors.getTotalElements())
                .hasNextPage(authors.hasNext())
                .hasPrevPage(authors.hasPrevious())
                .build();

        return PageResponse.<AuthorDTO>builder()
                .items(items)
                .meta(meta)
                .build();
    }

    public AuthorDTO getAuthorById(Long id) {
        return authorRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Author not found"));
    }

    public AuthorDTO createAuthor(AuthorDTO dto) {
        Author author = Author.builder()
                .name(dto.getName())
                .build();
        Author saved = authorRepository.save(author);
        return toDTO(saved);
    }

    public AuthorDTO updateAuthor(Long id, AuthorDTO dto) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));
        author.setName(dto.getName());
        Author updated = authorRepository.save(author);
        return toDTO(updated);
    }

    public void deleteAuthor(Long id) {
        authorRepository.deleteById(id);
    }

    private AuthorDTO toDTO(Author author) {
        return AuthorDTO.builder()
                .id(author.getId())
                .name(author.getName())
                .booksCount(author.getBooks() != null ? author.getBooks().size() : 0)
                .build();
    }
}
