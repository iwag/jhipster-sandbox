package io.github.iwag.jblog.web.rest;

import com.codahale.metrics.annotation.Timed;
import io.github.iwag.jblog.domain.KusaActivity;
import io.github.iwag.jblog.domain.KusaGroup;
import io.github.iwag.jblog.repository.KusaActivityRepository;
import io.github.iwag.jblog.repository.KusaGroupRepository;
import io.github.iwag.jblog.web.rest.errors.BadRequestAlertException;
import io.github.iwag.jblog.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing KusaGroup.
 */
@RestController
@RequestMapping("/api")
public class KusaGroupResource {

    private final Logger log = LoggerFactory.getLogger(KusaGroupResource.class);

    private static final String ENTITY_NAME = "kusaGroup";

    private final KusaGroupRepository kusaGroupRepository;
    private final KusaActivityRepository kusaActivityRepository;

    public KusaGroupResource(KusaGroupRepository kusaGroupRepository, KusaActivityRepository kusaActivityRepository) {
        this.kusaGroupRepository = kusaGroupRepository;
        this.kusaActivityRepository = kusaActivityRepository;
    }

    /**
     * POST  /kusa-groups : Create a new kusaGroup.
     *
     * @param kusaGroup the kusaGroup to create
     * @return the ResponseEntity with status 201 (Created) and with body the new kusaGroup, or with status 400 (Bad Request) if the kusaGroup has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/kusa-groups")
    @Timed
    public ResponseEntity<KusaGroup> createKusaGroup(@RequestBody KusaGroup kusaGroup) throws URISyntaxException {
        log.debug("REST request to save KusaGroup : {}", kusaGroup);
        if (kusaGroup.getId() != null) {
            throw new BadRequestAlertException("A new kusaGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        KusaGroup result = kusaGroupRepository.save(kusaGroup);
        return ResponseEntity.created(new URI("/api/kusa-groups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /kusa-groups : Updates an existing kusaGroup.
     *
     * @param kusaGroup the kusaGroup to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated kusaGroup,
     * or with status 400 (Bad Request) if the kusaGroup is not valid,
     * or with status 500 (Internal Server Error) if the kusaGroup couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/kusa-groups")
    @Timed
    public ResponseEntity<KusaGroup> updateKusaGroup(@RequestBody KusaGroup kusaGroup) throws URISyntaxException {
        log.debug("REST request to update KusaGroup : {}", kusaGroup);
        if (kusaGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        KusaGroup result = kusaGroupRepository.save(kusaGroup);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, kusaGroup.getId().toString()))
            .body(result);
    }

    /**
     * GET  /kusa-groups : get all the kusaGroups.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of kusaGroups in body
     */
    @GetMapping("/kusa-groups")
    @Timed
    public List<KusaGroup> getAllKusaGroups() {
        log.debug("REST request to get all KusaGroups");
        return kusaGroupRepository.findAll();
    }

    /**
     * GET  /kusa-groups/:id : get the "id" kusaGroup.
     *
     * @param id the id of the kusaGroup to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the kusaGroup, or with status 404 (Not Found)
     */
    @GetMapping("/kusa-groups/{id}")
    @Timed
    public ResponseEntity<KusaGroup> getKusaGroup(@PathVariable Long id) {
        log.debug("REST request to get KusaGroup : {}", id);
        Optional<KusaGroup> kusaGroup = kusaGroupRepository.findById(id);
        List<KusaActivity> list = kusaActivityRepository.findAllByGroupId(kusaGroup.get().getId());
        kusaGroup.ifPresent(c -> c.setActvities(new HashSet<>(list)));
        return ResponseUtil.wrapOrNotFound(kusaGroup);
    }

    /**
     * DELETE  /kusa-groups/:id : delete the "id" kusaGroup.
     *
     * @param id the id of the kusaGroup to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/kusa-groups/{id}")
    @Timed
    public ResponseEntity<Void> deleteKusaGroup(@PathVariable Long id) {
        log.debug("REST request to delete KusaGroup : {}", id);

        kusaGroupRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
