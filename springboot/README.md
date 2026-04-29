# HAIBAZO Book Reviews - Spring Boot Backend

Java Spring Boot backend API for HAIBAZO Book Review application.

## Features

- RESTful CRUD API for Authors, Books, and Reviews
- Spring Data JPA with Hibernate ORM
- Pagination support (5 items per page)
- Input validation with Jakarta Validation
- Cross-Origin Resource Sharing (CORS) enabled
- H2 in-memory database for development
- PostgreSQL support for production

## Requirements

- Java 17+
- Maven 3.6+

## Project Structure

```
src/main/java/com/haibazo/bookreviews/
├── HaibazoApplication.java          # Main Spring Boot application
├── controller/                       # REST API controllers
│   ├── AuthorController.java
│   ├── BookController.java
│   └── ReviewController.java
├── service/                          # Business logic
│   ├── AuthorService.java
│   ├── BookService.java
│   └── ReviewService.java
├── repository/                       # Data access layer
│   ├── AuthorRepository.java
│   ├── BookRepository.java
│   └── ReviewRepository.java
├── model/                            # JPA entities
│   ├── Author.java
│   ├── Book.java
│   └── Review.java
└── dto/                              # Data Transfer Objects
    ├── AuthorDTO.java
    ├── BookDTO.java
    ├── ReviewDTO.java
    └── PageResponse.java
```

## Setup

### 1. Prerequisites

```bash
# Check Java version (should be 17 or higher)
java -version

# Check Maven version
mvn -version
```

### 2. Build the project

```bash
# Navigate to backend-springboot directory
cd backend-springboot

# Clean and build
mvn clean install

# Or build without tests
mvn clean install -DskipTests
```

### 3. Run the application

```bash
# Run with embedded H2 database (development)
mvn spring-boot:run

# The application will start on http://localhost:8080
# H2 console available at http://localhost:8080/h2-console
```

## API Endpoints

All endpoints support pagination with query parameters:
- `page` (default: 1) - page number starting from 1
- `pageSize` (default: 5) - items per page

### Authors

- `GET /api/authors` - List all authors
- `GET /api/authors/{id}` - Get author by ID
- `POST /api/authors` - Create author
- `PUT /api/authors/{id}` - Update author
- `DELETE /api/authors/{id}` - Delete author

### Books

- `GET /api/books` - List all books
- `GET /api/books/{id}` - Get book by ID
- `POST /api/books` - Create book
- `PUT /api/books/{id}` - Update book
- `DELETE /api/books/{id}` - Delete book

### Reviews

- `GET /api/reviews` - List all reviews
- `GET /api/reviews/{id}` - Get review by ID
- `POST /api/reviews` - Create review
- `PUT /api/reviews/{id}` - Update review
- `DELETE /api/reviews/{id}` - Delete review

## Example Requests

### Create Author
```bash
curl -X POST http://localhost:8080/api/authors \
  -H "Content-Type: application/json" \
  -d '{"name": "F. Scott Fitzgerald"}'
```

### Create Book
```bash
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "The Great Gatsby", "authorId": 1}'
```

### Create Review
```bash
curl -X POST http://localhost:8080/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"bookId": 1, "review": "A masterpiece of American literature"}'
```

## Database Configuration

### H2 (Development - Default)

H2 is configured as the default database with automatic schema creation.

Access the H2 console at: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:bookreviews`
- Username: `sa`
- Password: (leave blank)

### PostgreSQL (Production)

1. Create a PostgreSQL database:
```bash
createdb haibazo_book_review
```

2. Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/haibazo_book_review
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
```

3. Run migrations:
```bash
mvn spring-boot:run
```

## Dependencies

- **Spring Boot 3.2.4**
- **Spring Data JPA** - ORM
- **Hibernate** - JPA implementation
- **PostgreSQL Driver** - PostgreSQL support
- **H2 Database** - Development database
- **Lombok** - Boilerplate code reduction
- **Jakarta Validation** - Input validation

## Testing

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthorServiceTest
```

## Build and Deployment

### Creating a JAR package

```bash
mvn clean package
java -jar target/book-reviews-1.0.0.jar
```

### Running as Docker container (optional)

```bash
# Build Docker image
docker build -t haibazo-bookreviews .

# Run container
docker run -p 8080:8080 haibazo-bookreviews
```

## Notes

- CORS is enabled for all origins during development
- Validation errors return `400 Bad Request` with detailed messages
- Resource not found errors return `404 Not Found`
- Successful creations return `201 Created`
- Successful deletions return `204 No Content`

## Troubleshooting

### Port already in use
```bash
# Change port in application.properties
server.port=8081
```

### Build fails with Java version error
```bash
# Set JAVA_HOME to Java 17+
export JAVA_HOME=/path/to/java17
```

## License

This project is part of HAIBAZO application suite.
