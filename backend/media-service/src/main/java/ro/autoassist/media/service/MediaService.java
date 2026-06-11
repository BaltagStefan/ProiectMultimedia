package ro.autoassist.media.service;

import java.io.InputStream;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import ro.autoassist.media.entity.MediaFile;
import ro.autoassist.media.repository.MediaFileRepository;

@Service
public class MediaService {
    private static final Set<String> ALLOWED = Set.of(
        "image/jpeg", "image/png", "audio/webm", "audio/mpeg", "video/mp4", "application/pdf");
    private final MinioClient minio;
    private final MediaFileRepository repository;
    private final String bucket;

    public MediaService(MinioClient minio, MediaFileRepository repository,
                        @Value("${minio.bucket}") String bucket) {
        this.minio = minio;
        this.repository = repository;
        this.bucket = bucket;
    }

    public MediaFile upload(MultipartFile file, String username) throws Exception {
        if (file.isEmpty() || !ALLOWED.contains(file.getContentType())) {
            throw new IllegalArgumentException("Tip de fișier neacceptat.");
        }
        ensureBucket();
        String objectKey = UUID.randomUUID() + "-" + safeName(file.getOriginalFilename());
        minio.putObject(PutObjectArgs.builder()
            .bucket(bucket)
            .object(objectKey)
            .stream(file.getInputStream(), file.getSize(), -1)
            .contentType(file.getContentType())
            .build());
        MediaFile media = new MediaFile();
        media.setOriginalFileName(safeName(file.getOriginalFilename()));
        media.setObjectKey(objectKey);
        media.setBucketName(bucket);
        media.setMimeType(file.getContentType());
        media.setFileSize(file.getSize());
        media.setUploadedBy(username);
        return repository.save(media);
    }

    public MediaFile one(Long id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Fișierul nu există."));
    }

    public InputStream download(Long id) throws Exception {
        MediaFile media = one(id);
        return minio.getObject(GetObjectArgs.builder()
            .bucket(media.getBucketName()).object(media.getObjectKey()).build());
    }

    public void delete(Long id) throws Exception {
        MediaFile media = one(id);
        minio.removeObject(RemoveObjectArgs.builder()
            .bucket(media.getBucketName()).object(media.getObjectKey()).build());
        repository.delete(media);
    }

    private void ensureBucket() throws Exception {
        if (!minio.bucketExists(BucketExistsArgs.builder().bucket(bucket).build())) {
            minio.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
        }
    }

    private String safeName(String value) {
        String name = value == null ? "upload.bin" : value;
        return name.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}

