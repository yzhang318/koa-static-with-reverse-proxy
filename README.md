# koa-static-with-reverse-proxy

[中文文档](./README-zh.md)

This project provides a ready-to-go static server and reverse proxy server using Koa and TypeScript.

![Architecture](doc/architecture.png)

# Usage

## Install Dependencies

I personally prefer `pnpm` thus the scripts are all written for using it. However, the same should go with `npm` and `yarn`.

```shell
$ pnpm install
```

## Configure

Check `config.sample.yml` and make any change you prefer. Copy-paste it as `config.yml` such that the program could read for it.

There is one `config.yml` under the folder for out-of-the-box usage.

## Run

```shell
$ node src/run.ts
```
## Style Check / Linting

ESLint is configured with Airbnb rule and Node environment. The configuration file is at `/.eslintrc.yml`.

```shell
$ pnpm lint
```
