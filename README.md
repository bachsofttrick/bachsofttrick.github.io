# Portfolio and blog site
Built using NextJS

Todo:
- [x] Add 2 Youtube videos in front of Project page, split between the screen on desktop,
not show up on phone 
  - [ ] Implement this feature in Youtube embed component on this page
- [ ] Implement a script for [resizing image](https://github.com/lovell/sharp), so I don't need a web page
for that
- [ ] Add full-text search engine to blog posts:
  - It is possible to extract all blog posts to json file, then [index](lunrjs.com) it.
  - Or we can go [sqlite](https://sql.js.org/#/) route
- Add comment box on blog posts (see if it is possible, since this is static page)
  - [ ] Add login screen (login, password)
  - [ ] Add register screen (login, password, name, email)
  - [ ] Add forgot password screen (email)
  - [ ] Add login to blog page, blog posts
  - [ ] Add comment box
    - [ ] Validate input (e.g., non-empty text)
    - [ ] Sanitize input (prevent XSS, HTML, SQL injection)
    - [ ] Spam & Abuse Prevention
    - [ ] Request size & rate limits (DoS)
  - [ ] Attach a backend for comment
```
{
  post_id: int primary auto_increment,
  user_id: int,
  content: String,
  parent_id: int, // for replies
  created_at: Date
}
```