# Portfolio and blog site
Built using NextJS and Markdown.
CI/CD by Github Actions.

## Todo
- [ ] Reorganize images by category, not just date, because posts from different categories
can have the same date, count
  - [ ] Might as well reorganize posts by year as well. old page ([category]/[id]) to new page ([category]/[year]/[id])
- [ ] Follow [https://aadi.is-a.dev/](https://aadi.is-a.dev/)
  - [ ] Implement Dark mode button to switch black and white
  - [ ] Set White to be the default
  - [ ] Music button would be nice, though not necessary
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
- A gallery out of md images (241111 Photography). There's also a separate gallery component
- Year/month filter with count of total posts
- Youtube and Double Youtube embed components
- Command for resizing images
- Command for scaffolding a new blog post
- Support OpenGraph protocol used in Facebook, Messenger, Instagram...
