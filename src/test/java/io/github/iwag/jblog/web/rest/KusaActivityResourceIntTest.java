package io.github.iwag.jblog.web.rest;

import io.github.iwag.jblog.BlogApp;

import io.github.iwag.jblog.domain.KusaActivity;
import io.github.iwag.jblog.repository.KusaActivityRepository;
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
 * Test class for the KusaActivityResource REST controller.
 *
 * @see KusaActivityResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = BlogApp.class)
public class KusaActivityResourceIntTest {

    private static final ZonedDateTime DEFAULT_DONE_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DONE_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private KusaActivityRepository kusaActivityRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restKusaActivityMockMvc;

    private KusaActivity kusaActivity;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final KusaActivityResource kusaActivityResource = new KusaActivityResource(kusaActivityRepository);
        this.restKusaActivityMockMvc = MockMvcBuilders.standaloneSetup(kusaActivityResource)
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
    public static KusaActivity createEntity(EntityManager em) {
        KusaActivity kusaActivity = new KusaActivity()
            .doneAt(DEFAULT_DONE_AT);
        return kusaActivity;
    }

    @Before
    public void initTest() {
        kusaActivity = createEntity(em);
    }

    @Test
    @Transactional
    public void createKusaActivity() throws Exception {
        int databaseSizeBeforeCreate = kusaActivityRepository.findAll().size();

        // Create the KusaActivity
        restKusaActivityMockMvc.perform(post("/api/kusa-activities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(kusaActivity)))
            .andExpect(status().isCreated());

        // Validate the KusaActivity in the database
        List<KusaActivity> kusaActivityList = kusaActivityRepository.findAll();
        assertThat(kusaActivityList).hasSize(databaseSizeBeforeCreate + 1);
        KusaActivity testKusaActivity = kusaActivityList.get(kusaActivityList.size() - 1);
        assertThat(testKusaActivity.getDoneAt()).isEqualTo(DEFAULT_DONE_AT);
    }

    @Test
    @Transactional
    public void createKusaActivityWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = kusaActivityRepository.findAll().size();

        // Create the KusaActivity with an existing ID
        kusaActivity.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restKusaActivityMockMvc.perform(post("/api/kusa-activities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(kusaActivity)))
            .andExpect(status().isBadRequest());

        // Validate the KusaActivity in the database
        List<KusaActivity> kusaActivityList = kusaActivityRepository.findAll();
        assertThat(kusaActivityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllKusaActivities() throws Exception {
        // Initialize the database
        kusaActivityRepository.saveAndFlush(kusaActivity);

        // Get all the kusaActivityList
        restKusaActivityMockMvc.perform(get("/api/kusa-activities?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(kusaActivity.getId().intValue())))
            .andExpect(jsonPath("$.[*].doneAt").value(hasItem(sameInstant(DEFAULT_DONE_AT))));
    }
    

    @Test
    @Transactional
    public void getKusaActivity() throws Exception {
        // Initialize the database
        kusaActivityRepository.saveAndFlush(kusaActivity);

        // Get the kusaActivity
        restKusaActivityMockMvc.perform(get("/api/kusa-activities/{id}", kusaActivity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(kusaActivity.getId().intValue()))
            .andExpect(jsonPath("$.doneAt").value(sameInstant(DEFAULT_DONE_AT)));
    }
    @Test
    @Transactional
    public void getNonExistingKusaActivity() throws Exception {
        // Get the kusaActivity
        restKusaActivityMockMvc.perform(get("/api/kusa-activities/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateKusaActivity() throws Exception {
        // Initialize the database
        kusaActivityRepository.saveAndFlush(kusaActivity);

        int databaseSizeBeforeUpdate = kusaActivityRepository.findAll().size();

        // Update the kusaActivity
        KusaActivity updatedKusaActivity = kusaActivityRepository.findById(kusaActivity.getId()).get();
        // Disconnect from session so that the updates on updatedKusaActivity are not directly saved in db
        em.detach(updatedKusaActivity);
        updatedKusaActivity
            .doneAt(UPDATED_DONE_AT);

        restKusaActivityMockMvc.perform(put("/api/kusa-activities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedKusaActivity)))
            .andExpect(status().isOk());

        // Validate the KusaActivity in the database
        List<KusaActivity> kusaActivityList = kusaActivityRepository.findAll();
        assertThat(kusaActivityList).hasSize(databaseSizeBeforeUpdate);
        KusaActivity testKusaActivity = kusaActivityList.get(kusaActivityList.size() - 1);
        assertThat(testKusaActivity.getDoneAt()).isEqualTo(UPDATED_DONE_AT);
    }

    @Test
    @Transactional
    public void updateNonExistingKusaActivity() throws Exception {
        int databaseSizeBeforeUpdate = kusaActivityRepository.findAll().size();

        // Create the KusaActivity

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restKusaActivityMockMvc.perform(put("/api/kusa-activities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(kusaActivity)))
            .andExpect(status().isBadRequest());

        // Validate the KusaActivity in the database
        List<KusaActivity> kusaActivityList = kusaActivityRepository.findAll();
        assertThat(kusaActivityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteKusaActivity() throws Exception {
        // Initialize the database
        kusaActivityRepository.saveAndFlush(kusaActivity);

        int databaseSizeBeforeDelete = kusaActivityRepository.findAll().size();

        // Get the kusaActivity
        restKusaActivityMockMvc.perform(delete("/api/kusa-activities/{id}", kusaActivity.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<KusaActivity> kusaActivityList = kusaActivityRepository.findAll();
        assertThat(kusaActivityList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(KusaActivity.class);
        KusaActivity kusaActivity1 = new KusaActivity();
        kusaActivity1.setId(1L);
        KusaActivity kusaActivity2 = new KusaActivity();
        kusaActivity2.setId(kusaActivity1.getId());
        assertThat(kusaActivity1).isEqualTo(kusaActivity2);
        kusaActivity2.setId(2L);
        assertThat(kusaActivity1).isNotEqualTo(kusaActivity2);
        kusaActivity1.setId(null);
        assertThat(kusaActivity1).isNotEqualTo(kusaActivity2);
    }
}
