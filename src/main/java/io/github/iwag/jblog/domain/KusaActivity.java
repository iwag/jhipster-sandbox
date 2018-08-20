package io.github.iwag.jblog.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A KusaActivity.
 */
@Entity
@Table(name = "kusa_activity")
public class KusaActivity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "done_at")
    private ZonedDateTime doneAt;

    @Column(name = "count")
    private Integer count;

    @ManyToOne
    @JsonIgnoreProperties("actvities")
    private KusaGroup kusaGroup;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDoneAt() {
        return doneAt;
    }

    public KusaActivity doneAt(ZonedDateTime doneAt) {
        this.doneAt = doneAt;
        return this;
    }

    public void setDoneAt(ZonedDateTime doneAt) {
        this.doneAt = doneAt;
    }

    public Integer getCount() {
        return count;
    }

    public KusaActivity count(Integer count) {
        this.count = count;
        return this;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public KusaGroup getKusaGroup() {
        return kusaGroup;
    }

    public KusaActivity kusaGroup(KusaGroup kusaGroup) {
        this.kusaGroup = kusaGroup;
        return this;
    }

    public void setKusaGroup(KusaGroup kusaGroup) {
        this.kusaGroup = kusaGroup;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        KusaActivity kusaActivity = (KusaActivity) o;
        if (kusaActivity.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), kusaActivity.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "KusaActivity{" +
            "id=" + getId() +
            ", doneAt='" + getDoneAt() + "'" +
            ", count=" + getCount() +
            "}";
    }
}
