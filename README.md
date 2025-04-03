# README

<!--toc:start-->

- [README](#readme)
  - [Deploying](#deploying)
  <!--toc:end-->

## Deploying

Update contents of the "public" directory then create a new branch which
only contains the content from the "public" directory push that branch to github

```bash
hugo build # update contents of the public directory
git subtree split --prefix public -b deploy-temp
git push origin deploy-temp:deploy --force
git branch -D deploy-temp
```
