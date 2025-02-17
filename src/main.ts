import { Application, Router, send } from "oak";

const app = new Application();
const router = new Router();

// 静态文件服务
router.get("/static/:path*", async (ctx) => {
  const path = ctx.params.path;
  if (path) {
    await send(ctx, path, {
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  }
});

// 主页路由
router.get("/", async (ctx) => {
  await send(ctx, "index.html", {
    root: `${Deno.cwd()}/public`,
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("服务器启动在 http://localhost:8000 🚀");
await app.listen({ port: 8000 }); 