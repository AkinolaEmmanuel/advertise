import { app } from "./app.js";
import { config } from "./config.js";
import { logger } from "./utils/logger.js";

app.listen(config.port, () => {
  logger.info(`Backend listening on http://localhost:${config.port}`);
});
