# Gift Huddle – Sign-up & Authentication Requirements (v1)
(See bundle for pink brand + auth UI wiring)

## Providers
- Email (verify then password)
- Google, Apple, Facebook (OAuth redirects)

## Key Policies
- Password >= 12 chars, 3 of 4 classes, zxcvbn >= 3
- Email must be verified before privileged actions
- DOB: day+month required, year optional (hide by default)
- Interests & preferred shops: multi-select
- Public lists viewable; order/comment requires auth
