package ro.autoassist.media.controller;

import java.io.InputStream;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ro.autoassist.media.entity.MediaFile;
import ro.autoassist.media.service.MediaService;

@RestController
@RequestMapping("/api/media")
public class MediaController {
    private final MediaService service;
    public MediaController(MediaService service) { this.service = service; }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MediaFile upload(@RequestParam("file") MultipartFile file, Authentication authentication)
        throws Exception {
        return service.upload(file, authentication.getName());
    }

    @GetMapping("/{id}")
    public MediaFile one(@PathVariable Long id) { return service.one(id); }

    @GetMapping("/{id}/download")
    public ResponseEntity<InputStreamResource> download(@PathVariable Long id) throws Exception {
        MediaFile media = service.one(id);
        InputStream stream = service.download(id);
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(media.getMimeType()))
            .header(HttpHeaders.CONTENT_DISPOSITION,
                ContentDisposition.attachment().filename(media.getOriginalFileName()).build().toString())
            .body(new InputStreamResource(stream));
    }

    @GetMapping("/{id}/content")
    public ResponseEntity<InputStreamResource> content(@PathVariable Long id) throws Exception {
        MediaFile media = service.one(id);
        InputStream stream = service.download(id);
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(media.getMimeType()))
            .contentLength(media.getFileSize())
            .header(HttpHeaders.CONTENT_DISPOSITION,
                ContentDisposition.inline().filename(media.getOriginalFileName()).build().toString())
            .body(new InputStreamResource(stream));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) throws Exception { service.delete(id); }
}
