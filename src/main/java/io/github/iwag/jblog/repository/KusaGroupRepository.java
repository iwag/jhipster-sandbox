package io.github.iwag.jblog.repository;

import io.github.iwag.jblog.domain.KusaGroup;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the KusaGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KusaGroupRepository extends JpaRepository<KusaGroup, Long> {

    @Query("select kusa_group from KusaGroup kusa_group where kusa_group.user.login = ?#{principal.username}")
    List<KusaGroup> findByUserIsCurrentUser();

}
