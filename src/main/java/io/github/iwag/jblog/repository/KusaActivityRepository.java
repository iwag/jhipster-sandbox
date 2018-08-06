package io.github.iwag.jblog.repository;

import io.github.iwag.jblog.domain.KusaActivity;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the KusaActivity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KusaActivityRepository extends JpaRepository<KusaActivity, Long> {

}
