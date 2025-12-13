# Portfolio and blog site
Built using NextJS and Markdown.  
CI/CD by Github Actions.  
Located here: [https://bachsofttrick.github.io/](https://bachsofttrick.github.io/)

## Todo
- [ ] Follow [https://aadi.is-a.dev/](https://aadi.is-a.dev/)
  - [ ] Implement Dark mode button to switch black and white
  - [ ] Set White to be the default
  - [ ] Music button would be nice, though not necessary
- [ ] Add full-text search engine to blog posts:
  - It is possible to extract all blog posts to json file, then [index](lunrjs.com) it.
  - Or we can go [sqlite](https://sql.js.org/#/) route
- [ ] Add comment box on blog posts. The steps below is for a DIY solution.  
Another way is to use headless Wordpress, post with slug -> comment API from post id.
Add in Akismet + optional reCAPTCHA + rate limiting.
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
