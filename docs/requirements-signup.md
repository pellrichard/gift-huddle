# Gift Huddle – Sign-up & Authentication Requirements (v1)

**Stack:** Supabase Auth (email + Google/Apple/Facebook). Email requires verification before password set.
**Password policy:** >= 12 chars, 3 of 4 classes, zxcvbn >= 3.
**Profile:** name, handle, DOB (hide year), interests, preferred shops, social links. Friend requests require approval.
**Public lists:** viewable via link; "mark as ordered" gated by auth.
