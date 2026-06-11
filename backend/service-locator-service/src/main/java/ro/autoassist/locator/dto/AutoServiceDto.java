package ro.autoassist.locator.dto;

import java.math.BigDecimal;

public record AutoServiceDto(
    Long id,
    String name,
    String type,
    String description,
    String phone,
    String email,
    BigDecimal rating,
    String address,
    String city,
    Double latitude,
    Double longitude
) {}

