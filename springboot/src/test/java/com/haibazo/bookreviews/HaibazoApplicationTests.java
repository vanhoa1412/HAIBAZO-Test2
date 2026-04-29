package com.haibazo.bookreviews;

import com.haibazo.bookreviews.controller.AuthorController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class HaibazoApplicationTests {

    @Autowired
    private AuthorController authorController;

    @Test
    void contextLoads() {
        assertThat(authorController).isNotNull();
    }
}
