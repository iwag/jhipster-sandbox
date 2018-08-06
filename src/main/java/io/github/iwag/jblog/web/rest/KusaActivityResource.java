package io.github.iwag.jblog.web.rest;

import com.codahale.metrics.annotation.Timed;
import io.github.iwag.jblog.domain.KusaActivity;
import io.github.iwag.jblog.repository.KusaActivityRepository;
import io.github.iwag.jblog.web.rest.errors.BadRequestAlertException;
import io.github.iwag.jblog.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing KusaActivity.
 */
@RestController
@RequestMapping("/api")
public class KusaActivityResource {

    private final Logger log = LoggerFactory.getLogger(KusaActivityResource.class);

    private static final String ENTITY_NAME = "kusaActivity";

    private final KusaActivityRepository kusaActivityRepository;

    public KusaActivityResource(KusaActivityRepository kusaActivityRepository) {
        this.kusaActivityRepository = kusaActivityRepository;
    }

    /**
     * POST  /kusa-activities : Create a new kusaActivity.
     *
     * @param kusaActivity the kusaActivity to create
     * @return the ResponseEntity with status 201 (Created) and with body the new kusaActivity, or with status 400 (Bad Request) if the kusaActivity has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/kusa-activities")
    @Timed
    public ResponseEntity<KusaActivity> createKusaActivity(@RequestBody KusaActivity kusaActivity) throws URISyntaxException {
        log.debug("REST request to save KusaActivity : {}", kusaActivity);
        if (kusaActivity.getId() != null) {
            throw new BadRequestAlertException("A new kusaActivity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        KusaActivity result = kusaActivityRepository.save(kusaActivity);
        return ResponseEntity.created(new URI("/api/kusa-activities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /kusa-activities : Updates an existing kusaActivity.
     *
     * @param kusaActivity the kusaActivity to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated kusaActivity,
     * or with status 400 (Bad Request) if the kusaActivity is not valid,
     * or with status 500 (Internal Server Error) if the kusaActivity couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/kusa-activities")
    @Timed
    public ResponseEntity<KusaActivity> updateKusaActivity(@RequestBody KusaActivity kusaActivity) throws URISyntaxException {
        log.debug("REST request to update KusaActivity : {}", kusaActivity);
        if (kusaActivity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        KusaActivity result = kusaActivityRepository.save(kusaActivity);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, kusaActivity.getId().toString()))
            .body(result);
    }

    /**
     * GET  /kusa-activities : get all the kusaActivities.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of kusaActivities in body
     */
    @GetMapping("/kusa-activities")
    @Timed
    public List<KusaActivity> getAllKusaActivities() {
        log.debug("REST request to get all KusaActivities");
        return kusaActivityRepository.findAll();
    }

    /**
     * GET  /kusa-activities/:id : get the "id" kusaActivity.
     *
     * @param id the id of the kusaActivity to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the kusaActivity, or with status 404 (Not Found)
     */
    @GetMapping("/kusa-activities/{id}")
    @Timed
    public ResponseEntity<KusaActivity> getKusaActivity(@PathVariable Long id) {
        log.debug("REST request to get KusaActivity : {}", id);
        Optional<KusaActivity> kusaActivity = kusaActivityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(kusaActivity);
    }

    /**
     * DELETE  /kusa-activities/:id : delete the "id" kusaActivity.
     *
     * @param id the id of the kusaActivity to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/kusa-activities/{id}")
    @Timed
    public ResponseEntity<Void> deleteKusaActivity(@PathVariable Long id) {
        log.debug("REST request to delete KusaActivity : {}", id);

        kusaActivityRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
