# Portfolio and blog site
Built using NextJS and Markdown.

## Todo
- [x] Create a script that scaffording a markdown template file so I can write blog
faster without copying a pre-existing post
  - [ ] `publishedAt: 20251121` is not correct, is `publishedAt: 2025-11-21`
  - [ ] Filename should be `251121.md`, not `20251121-1.md`
  - [ ] Fix bug not creating post #2 when they have the same publishedAt
- [ ] Update image gallery component to be a separate one like YoutubeEmbed
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

## Finished features
- A gallery out of md images (241111 Photography)
- Year/month filter with count of total posts
- Youtube and Double Youtube embed components
- Script for resizing images
