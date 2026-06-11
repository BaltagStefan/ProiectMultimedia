package ro.autoassist.media.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ro.autoassist.media.entity.MediaFile;

public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {}

