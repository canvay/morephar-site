// 确保数据库中存在与前端镜像 build arg 匹配的 full-access API token。
// 用途: docker 本地测试空库初始化（scripts/local-test.sh 调用）。
// 用法: 在 strapi 容器内执行  node /app/init-api-token.cjs <tokenValue>
// 原理: Strapi 5 校验 content-api token 时用 HMAC-SHA512(accessKey, API_TOKEN_SALT)
//       作为 access_key 查库，kind 需为 'content-api'（或 NULL），type='full-access' 即全权限。
const crypto = require("crypto");
const Database = require("better-sqlite3");

const tokenValue = process.argv[2];
if (!tokenValue) {
  console.error("usage: node init-api-token.cjs <tokenValue>");
  process.exit(1);
}
const salt = process.env.API_TOKEN_SALT;
if (!salt) {
  console.error("API_TOKEN_SALT env var is required");
  process.exit(1);
}
const hashed = crypto.createHmac("sha512", salt).update(tokenValue).digest("hex");

const db = new Database("/app/.tmp/data.db");

const existing = db.prepare("SELECT id FROM strapi_api_tokens WHERE access_key = ?").get(hashed);
if (existing) {
  console.log(`API token already present (id ${existing.id}), skip`);
  process.exit(0);
}

// 兼容列名差异，按实际表结构拼 INSERT
const cols = db.prepare("PRAGMA table_info(strapi_api_tokens)").all().map((c) => c.name);
const has = (n) => cols.includes(n);
const names = db.prepare("SELECT id FROM strapi_api_tokens WHERE name = ?").get("localtest-full-access");
if (names) {
  db.prepare("UPDATE strapi_api_tokens SET access_key = ?, kind = 'content-api', type = 'full-access' WHERE id = ?")
    .run(hashed, names.id);
  console.log(`updated existing token (id ${names.id})`);
  process.exit(0);
}

const colNames = [];
const vals = [];
const push = (col, val) => { colNames.push(col); vals.push(val); };
push("name", "localtest-full-access");
push("description", "Full access token for local docker test");
push("type", "full-access");
if (has("kind")) push("kind", "content-api");
push("access_key", hashed);
if (has("last_used_at")) push("last_used_at", null);
if (has("expires_at")) push("expires_at", null);
if (has("lifespan")) push("lifespan", null);
const now = new Date().toISOString();
if (has("created_at")) push("created_at", now);
if (has("updated_at")) push("updated_at", now);

const info = db
  .prepare(`INSERT INTO strapi_api_tokens (${colNames.join(", ")}) VALUES (${colNames.map(() => "?").join(", ")})`)
  .run(...vals);
console.log(`inserted API token (id ${info.lastInsertRowid})`);
db.close();
