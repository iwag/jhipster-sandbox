package io.github.iwag.jblog.repository;

import io.github.iwag.jblog.domain.AccountUser;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the AccountUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AccountUserRepository extends JpaRepository<AccountUser, Long> {

}
