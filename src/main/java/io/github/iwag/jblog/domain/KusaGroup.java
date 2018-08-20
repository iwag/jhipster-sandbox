package io.github.iwag.jblog.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A KusaGroup.
 */
@Entity
@Table(name = "kusa_group")
public class KusaGroup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "jhi_body")
    private String body;

    @OneToMany(mappedBy = "kusaGroup")
    private Set<KusaActivity> actvities = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public KusaGroup title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public KusaGroup body(String body) {
        this.body = body;
        return this;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Set<KusaActivity> getActvities() {
        return actvities;
    }

    public KusaGroup actvities(Set<KusaActivity> kusaActivities) {
        this.actvities = kusaActivities;
        return this;
    }

    public KusaGroup addActvities(KusaActivity kusaActivity) {
        this.actvities.add(kusaActivity);
        kusaActivity.setKusaGroup(this);
        return this;
    }

    public KusaGroup removeActvities(KusaActivity kusaActivity) {
        this.actvities.remove(kusaActivity);
        kusaActivity.setKusaGroup(null);
        return this;
    }

    public void setActvities(Set<KusaActivity> kusaActivities) {
        this.actvities = kusaActivities;
    }

    public User getUser() {
        return user;
    }

    public KusaGroup user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
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
        KusaGroup kusaGroup = (KusaGroup) o;
        if (kusaGroup.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), kusaGroup.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "KusaGroup{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", body='" + getBody() + "'" +
            "}";
    }
}
