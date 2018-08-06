package io.github.iwag.jblog.repository;

import io.github.iwag.jblog.domain.KusaGroup;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the KusaGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KusaGroupRepository extends JpaRepository<KusaGroup, Long> {

}
