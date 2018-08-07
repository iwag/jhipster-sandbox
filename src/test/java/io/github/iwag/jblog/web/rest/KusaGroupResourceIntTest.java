package io.github.iwag.jblog.web.rest;

import io.github.iwag.jblog.BlogApp;

import io.github.iwag.jblog.domain.KusaGroup;
import io.github.iwag.jblog.repository.KusaGroupRepository;
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
import java.util.List;


import static io.github.iwag.jblog.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the KusaGroupResource REST controller.
 *
 * @see KusaGroupResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = BlogApp.class)
public class KusaGroupResourceIntTest {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_BODY = "AAAAAAAAAA";
    private static final String UPDATED_BODY = "BBBBBBBBBB";

    @Autowired
    private KusaGroupRepository kusaGroupRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restKusaGroupMockMvc;

    private KusaGroup kusaGroup;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final KusaGroupResource kusaGroupResource = new KusaGroupResource(kusaGroupRepository);
        this.restKusaGroupMockMvc = MockMvcBuilders.standaloneSetup(kusaGroupResource)
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
    public static KusaGroup createEntity(EntityManager em) {
        KusaGroup kusaGroup = new KusaGroup()
            .title(DEFAULT_TITLE)
            .body(DEFAULT_BODY);
        return kusaGroup;
    }

    @Before
    public void initTest() {
        kusaGroup = createEntity(em);
    }

    @Test
    @Transactional
    public void createKusaGroup() throws Exception {
        int databaseSizeBeforeCreate = kusaGroupRepository.findAll().size();

        // Create the KusaGroup
        restKusaGroupMockMvc.perform(post("/api/kusa-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(kusaGroup)))
            .andExpect(status().isCreated());

        // Validate the KusaGroup in the database
        List<KusaGroup> kusaGroupList = kusaGroupRepository.findAll();
        assertThat(kusaGroupList).hasSize(databaseSizeBeforeCreate + 1);
        KusaGroup testKusaGroup = kusaGroupList.get(kusaGroupList.size() - 1);
        assertThat(testKusaGroup.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testKusaGroup.getBody()).isEqualTo(DEFAULT_BODY);
    }

    @Test
    @Transactional
    public void createKusaGroupWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = kusaGroupRepository.findAll().size();

        // Create the KusaGroup with an existing ID
        kusaGroup.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restKusaGroupMockMvc.perform(post("/api/kusa-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(kusaGroup)))
            .andExpect(status().isBadRequest());

        // Validate the KusaGroup in the database
        List<KusaGroup> kusaGroupList = kusaGroupRepository.findAll();
        assertThat(kusaGroupList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllKusaGroups() throws Exception {
        // Initialize the database
        kusaGroupRepository.saveAndFlush(kusaGroup);

        // Get all the kusaGroupList
        restKusaGroupMockMvc.perform(get("/api/kusa-groups?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(kusaGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].body").value(hasItem(DEFAULT_BODY.toString())));
    }
    

    @Test
    @Transactional
    public void getKusaGroup() throws Exception {
        // Initialize the database
        kusaGroupRepository.saveAndFlush(kusaGroup);

        // Get the kusaGroup
        restKusaGroupMockMvc.perform(get("/api/kusa-groups/{id}", kusaGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(kusaGroup.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.body").value(DEFAULT_BODY.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingKusaGroup() throws Exception {
        // Get the kusaGroup
        restKusaGroupMockMvc.perform(get("/api/kusa-groups/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateKusaGroup() throws Exception {
        // Initialize the database
        kusaGroupRepository.saveAndFlush(kusaGroup);

        int databaseSizeBeforeUpdate = kusaGroupRepository.findAll().size();

        // Update the kusaGroup
        KusaGroup updatedKusaGroup = kusaGroupRepository.findById(kusaGroup.getId()).get();
        // Disconnect from session so that the updates on updatedKusaGroup are not directly saved in db
        em.detach(updatedKusaGroup);
        updatedKusaGroup
            .title(UPDATED_TITLE)
            .body(UPDATED_BODY);

        restKusaGroupMockMvc.perform(put("/api/kusa-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedKusaGroup)))
            .andExpect(status().isOk());

        // Validate the KusaGroup in the database
        List<KusaGroup> kusaGroupList = kusaGroupRepository.findAll();
        assertThat(kusaGroupList).hasSize(databaseSizeBeforeUpdate);
        KusaGroup testKusaGroup = kusaGroupList.get(kusaGroupList.size() - 1);
        assertThat(testKusaGroup.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testKusaGroup.getBody()).isEqualTo(UPDATED_BODY);
    }

    @Test
    @Transactional
    public void updateNonExistingKusaGroup() throws Exception {
        int databaseSizeBeforeUpdate = kusaGroupRepository.findAll().size();

        // Create the KusaGroup

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restKusaGroupMockMvc.perform(put("/api/kusa-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(kusaGroup)))
            .andExpect(status().isBadRequest());

        // Validate the KusaGroup in the database
        List<KusaGroup> kusaGroupList = kusaGroupRepository.findAll();
        assertThat(kusaGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteKusaGroup() throws Exception {
        // Initialize the database
        kusaGroupRepository.saveAndFlush(kusaGroup);

        int databaseSizeBeforeDelete = kusaGroupRepository.findAll().size();

        // Get the kusaGroup
        restKusaGroupMockMvc.perform(delete("/api/kusa-groups/{id}", kusaGroup.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<KusaGroup> kusaGroupList = kusaGroupRepository.findAll();
        assertThat(kusaGroupList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(KusaGroup.class);
        KusaGroup kusaGroup1 = new KusaGroup();
        kusaGroup1.setId(1L);
        KusaGroup kusaGroup2 = new KusaGroup();
        kusaGroup2.setId(kusaGroup1.getId());
        assertThat(kusaGroup1).isEqualTo(kusaGroup2);
        kusaGroup2.setId(2L);
        assertThat(kusaGroup1).isNotEqualTo(kusaGroup2);
        kusaGroup1.setId(null);
        assertThat(kusaGroup1).isNotEqualTo(kusaGroup2);
    }
}
