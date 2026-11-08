# Security Specification — RY WHEELS Dealership Platform

## 1. Data Invariants
1. **Global Default-Deny**: Any path not explicitly matched is denied for all reads and writes.
2. **Path Variable Hardening**: Every single-document operation (`get`, `create`, `update`, `delete`) validates its path ID with `isValidId(id)` (`id is string && id.size() >= 1 && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$')`).
3. **Verified Identity**: Write operations require a signed-in user with `request.auth.token.email_verified == true`.
4. **Admin Authorization**: Admin rights are granted only to verified users whose UID exists in `/admins/$(request.auth.uid)` or whose verified email matches the bootstrapped admin (`siakaabdulqabid@gmail.com` with `email_verified == true`).
5. **Query Enforcement (`allow list`)**: No blanket reads. Every `allow list` rule evaluates `resource.data.visibility == 'public'` or `isAdmin()`.
6. **Temporal Integrity**: `createdAt` must equal `request.time` on `create` and remain immutable (`incoming().createdAt == existing().createdAt`) on `update`. `updatedAt` must equal `request.time` on both `create` and `update`.
7. **Strict Key & Size Enforcement**: Every entity validation helper enforces `.keys().hasAll(...)` and `.keys().hasOnly(...)` along with strict `.size()` bounds on all strings.

## 2. The "Dirty Dozen" Payloads
1. **Unverified Admin Spoof**: `auth: { uid: 'attacker', token: { email: 'siakaabdulqabid@gmail.com', email_verified: false } }` attempting to create a vehicle in `/vehicles/v1`. -> `PERMISSION_DENIED`
2. **Shadow Field Injection on Review**: Creating `/reviews/rev1` with an extra field `"isAdminApproved": true` not in `hasOnly`. -> `PERMISSION_DENIED`
3. **Identity Spoofing on Review**: User `uid_a` creating `/reviews/rev1` with `authorId: 'uid_b'`. -> `PERMISSION_DENIED`
4. **Forged Timestamp on Review**: Creating `/reviews/rev1` with a past or future client timestamp `createdAt != request.time`. -> `PERMISSION_DENIED`
5. **Immutable Field Tampering**: Updating `/reviews/rev1` while modifying `createdAt` or `authorId`. -> `PERMISSION_DENIED`
6. **Out-of-Range Rating**: Creating `/reviews/rev1` with `rating: 99` or `rating: 0`. -> `PERMISSION_DENIED`
7. **Oversized Comment Payload (Denial of Wallet)**: Creating `/reviews/rev1` with a 5,000-character `comment` exceeding `maxLength: 600`. -> `PERMISSION_DENIED`
8. **Invalid Path ID Poisoning**: Creating `/reviews/bad$id!@#` with non-alphanumeric characters. -> `PERMISSION_DENIED`
9. **Unauthorized Gallery Mutation**: Standard non-admin user attempting to create or delete `/gallery/gal1`. -> `PERMISSION_DENIED`
10. **Unauthorized Vehicle Price Edit**: Standard non-admin user attempting to update `/vehicles/veh1`. -> `PERMISSION_DENIED`
11. **Unfiltered List Scrape of Hidden Documents**: Unauthenticated user querying `/reviews` without `where('visibility', '==', 'public')`. -> `PERMISSION_DENIED`
12. **Self-Assigned Admin Record**: Standard user attempting to write `/admins/their_uid` without already being the bootstrapped admin. -> `PERMISSION_DENIED`
