# 개발 파이프라인

이슈 등록부터 PR 리뷰까지, `.claude/commands`·`.claude/skills`에 구성된 Claude Code 커맨드와 스킬이 어디서 개입하는지 나타낸 다이어그램입니다.

![Claude Code 개발 파이프라인](images/dev-pipeline.svg)

`husky pre-commit` 게이트는 커밋 전에 `pnpm lint`(turbo로 모든 앱·패키지 lint)를 실행합니다. lint 오류가 있으면 커밋이 막힙니다. 나머지 단계는 `.claude/commands`·`.claude/skills`에 구성되어 있습니다.
