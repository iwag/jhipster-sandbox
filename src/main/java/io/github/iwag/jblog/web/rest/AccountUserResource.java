package io.github.iwag.jblog.web.rest;

import com.codahale.metrics.annotation.Timed;
import io.github.iwag.jblog.domain.AccountUser;
import io.github.iwag.jblog.repository.AccountUserRepository;
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
 * REST controller for managing AccountUser.
 */
@RestController
@RequestMapping("/api")
public class AccountUserResource {

    private final Logger log = LoggerFactory.getLogger(AccountUserResource.class);

    private static final String ENTITY_NAME = "accountUser";

    private final AccountUserRepository accountUserRepository;

    public AccountUserResource(AccountUserRepository accountUserRepository) {
        this.accountUserRepository = accountUserRepository;
    }

    /**
     * POST  /account-users : Create a new accountUser.
     *
     * @param accountUser the accountUser to create
     * @return the ResponseEntity with status 201 (Created) and with body the new accountUser, or with status 400 (Bad Request) if the accountUser has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/account-users")
    @Timed
    public ResponseEntity<AccountUser> createAccountUser(@RequestBody AccountUser accountUser) throws URISyntaxException {
        log.debug("REST request to save AccountUser : {}", accountUser);
        if (accountUser.getId() != null) {
            throw new BadRequestAlertException("A new accountUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AccountUser result = accountUserRepository.save(accountUser);
        return ResponseEntity.created(new URI("/api/account-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /account-users : Updates an existing accountUser.
     *
     * @param accountUser the accountUser to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated accountUser,
     * or with status 400 (Bad Request) if the accountUser is not valid,
     * or with status 500 (Internal Server Error) if the accountUser couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/account-users")
    @Timed
    public ResponseEntity<AccountUser> updateAccountUser(@RequestBody AccountUser accountUser) throws URISyntaxException {
        log.debug("REST request to update AccountUser : {}", accountUser);
        if (accountUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        AccountUser result = accountUserRepository.save(accountUser);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, accountUser.getId().toString()))
            .body(result);
    }

    /**
     * GET  /account-users : get all the accountUsers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of accountUsers in body
     */
    @GetMapping("/account-users")
    @Timed
    public List<AccountUser> getAllAccountUsers() {
        log.debug("REST request to get all AccountUsers");
        return accountUserRepository.findAll();
    }

    /**
     * GET  /account-users/:id : get the "id" accountUser.
     *
     * @param id the id of the accountUser to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the accountUser, or with status 404 (Not Found)
     */
    @GetMapping("/account-users/{id}")
    @Timed
    public ResponseEntity<AccountUser> getAccountUser(@PathVariable Long id) {
        log.debug("REST request to get AccountUser : {}", id);
        Optional<AccountUser> accountUser = accountUserRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(accountUser);
    }

    /**
     * DELETE  /account-users/:id : delete the "id" accountUser.
     *
     * @param id the id of the accountUser to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/account-users/{id}")
    @Timed
    public ResponseEntity<Void> deleteAccountUser(@PathVariable Long id) {
        log.debug("REST request to delete AccountUser : {}", id);

        accountUserRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
