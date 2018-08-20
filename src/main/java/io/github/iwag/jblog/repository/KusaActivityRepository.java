package io.github.iwag.jblog.repository;

import io.github.iwag.jblog.domain.KusaActivity;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the KusaActivity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KusaActivityRepository extends JpaRepository<KusaActivity, Long> {


    @Query("select t from KusaActivity t where t.kusaGroup.id = ?1")
    List<KusaActivity> findAllByGroupId(Long id);

}
