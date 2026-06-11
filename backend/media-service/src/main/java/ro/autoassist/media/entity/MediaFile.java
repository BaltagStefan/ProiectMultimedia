package ro.autoassist.media.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "media_files")
public class MediaFile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "original_file_name") private String originalFileName;
    @Column(name = "object_key") private String objectKey;
    @Column(name = "bucket_name") private String bucketName;
    @Column(name = "mime_type") private String mimeType;
    @Column(name = "file_size") private Long fileSize;
    @Column(name = "uploaded_by") private String uploadedBy;
    @Column(name = "created_at") private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String value) { originalFileName = value; }
    public String getObjectKey() { return objectKey; }
    public void setObjectKey(String value) { objectKey = value; }
    public String getBucketName() { return bucketName; }
    public void setBucketName(String value) { bucketName = value; }
    public String getMimeType() { return mimeType; }
    public void setMimeType(String value) { mimeType = value; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long value) { fileSize = value; }
    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String value) { uploadedBy = value; }
    public Instant getCreatedAt() { return createdAt; }
}

