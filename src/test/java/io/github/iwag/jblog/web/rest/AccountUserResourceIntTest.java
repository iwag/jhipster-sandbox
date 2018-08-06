package io.github.iwag.jblog.web.rest;

import io.github.iwag.jblog.BlogApp;

import io.github.iwag.jblog.domain.AccountUser;
import io.github.iwag.jblog.repository.AccountUserRepository;
import io.github.iwag.jblog.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;


import static io.github.iwag.jblog.web.rest.TestUtil.sameInstant;
import static io.github.iwag.jblog.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the AccountUserResource REST controller.
 *
 * @see AccountUserResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = BlogApp.class)
public class AccountUserResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private AccountUserRepository accountUserRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restAccountUserMockMvc;

    private AccountUser accountUser;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AccountUserResource accountUserResource = new AccountUserResource(accountUserRepository);
        this.restAccountUserMockMvc = MockMvcBuilders.standaloneSetup(accountUserResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountUser createEntity(EntityManager em) {
        AccountUser accountUser = new AccountUser()
            .name(DEFAULT_NAME)
            .createdAt(DEFAULT_CREATED_AT);
        return accountUser;
    }

    @Before
    public void initTest() {
        accountUser = createEntity(em);
    }

    @Test
    @Transactional
    public void createAccountUser() throws Exception {
        int databaseSizeBeforeCreate = accountUserRepository.findAll().size();

        // Create the AccountUser
        restAccountUserMockMvc.perform(post("/api/account-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(accountUser)))
            .andExpect(status().isCreated());

        // Validate the AccountUser in the database
        List<AccountUser> accountUserList = accountUserRepository.findAll();
        assertThat(accountUserList).hasSize(databaseSizeBeforeCreate + 1);
        AccountUser testAccountUser = accountUserList.get(accountUserList.size() - 1);
        assertThat(testAccountUser.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAccountUser.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
    }

    @Test
    @Transactional
    public void createAccountUserWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = accountUserRepository.findAll().size();

        // Create the AccountUser with an existing ID
        accountUser.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAccountUserMockMvc.perform(post("/api/account-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(accountUser)))
            .andExpect(status().isBadRequest());

        // Validate the AccountUser in the database
        List<AccountUser> accountUserList = accountUserRepository.findAll();
        assertThat(accountUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllAccountUsers() throws Exception {
        // Initialize the database
        accountUserRepository.saveAndFlush(accountUser);

        // Get all the accountUserList
        restAccountUserMockMvc.perform(get("/api/account-users?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(accountUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))));
    }
    

    @Test
    @Transactional
    public void getAccountUser() throws Exception {
        // Initialize the database
        accountUserRepository.saveAndFlush(accountUser);

        // Get the accountUser
        restAccountUserMockMvc.perform(get("/api/account-users/{id}", accountUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(accountUser.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)));
    }
    @Test
    @Transactional
    public void getNonExistingAccountUser() throws Exception {
        // Get the accountUser
        restAccountUserMockMvc.perform(get("/api/account-users/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAccountUser() throws Exception {
        // Initialize the database
        accountUserRepository.saveAndFlush(accountUser);

        int databaseSizeBeforeUpdate = accountUserRepository.findAll().size();

        // Update the accountUser
        AccountUser updatedAccountUser = accountUserRepository.findById(accountUser.getId()).get();
        // Disconnect from session so that the updates on updatedAccountUser are not directly saved in db
        em.detach(updatedAccountUser);
        updatedAccountUser
            .name(UPDATED_NAME)
            .createdAt(UPDATED_CREATED_AT);

        restAccountUserMockMvc.perform(put("/api/account-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAccountUser)))
            .andExpect(status().isOk());

        // Validate the AccountUser in the database
        List<AccountUser> accountUserList = accountUserRepository.findAll();
        assertThat(accountUserList).hasSize(databaseSizeBeforeUpdate);
        AccountUser testAccountUser = accountUserList.get(accountUserList.size() - 1);
        assertThat(testAccountUser.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAccountUser.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    public void updateNonExistingAccountUser() throws Exception {
        int databaseSizeBeforeUpdate = accountUserRepository.findAll().size();

        // Create the AccountUser

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restAccountUserMockMvc.perform(put("/api/account-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(accountUser)))
            .andExpect(status().isBadRequest());

        // Validate the AccountUser in the database
        List<AccountUser> accountUserList = accountUserRepository.findAll();
        assertThat(accountUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteAccountUser() throws Exception {
        // Initialize the database
        accountUserRepository.saveAndFlush(accountUser);

        int databaseSizeBeforeDelete = accountUserRepository.findAll().size();

        // Get the accountUser
        restAccountUserMockMvc.perform(delete("/api/account-users/{id}", accountUser.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<AccountUser> accountUserList = accountUserRepository.findAll();
        assertThat(accountUserList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AccountUser.class);
        AccountUser accountUser1 = new AccountUser();
        accountUser1.setId(1L);
        AccountUser accountUser2 = new AccountUser();
        accountUser2.setId(accountUser1.getId());
        assertThat(accountUser1).isEqualTo(accountUser2);
        accountUser2.setId(2L);
        assertThat(accountUser1).isNotEqualTo(accountUser2);
        accountUser1.setId(null);
        assertThat(accountUser1).isNotEqualTo(accountUser2);
    }
}
