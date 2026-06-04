type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

const levels: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 50,
};

const colors = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};

function currentLevel(): LogLevel {
  const level = process.env.LOG_LEVEL?.toLowerCase();
  if (level === "debug" || level === "info" || level === "warn" || level === "error" || level === "silent") {
    return level;
  }

  return "info";
}

function shouldUseColor() {
  return !process.env.NO_COLOR;
}

function colorize(value: string, color: string) {
  if (!shouldUseColor()) return value;
  return `${color}${value}${colors.reset}`;
}

function formatLevel(level: Exclude<LogLevel, "silent">) {
  const label = level.toUpperCase().padEnd(5);
  const colorByLevel = {
    debug: colors.gray,
    info: colors.green,
    warn: colors.yellow,
    error: colors.red,
  };

  return colorize(label, colorByLevel[level]);
}

function formatMessage(value: unknown) {
  if (value instanceof Error) return value.stack || value.message;
  if (typeof value === "string") return value;

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function write(level: Exclude<LogLevel, "silent">, values: unknown[]) {
  if (levels[level] < levels[currentLevel()]) return;

  const timestamp = colorize(new Date().toISOString(), colors.gray);
  const message = values.map(formatMessage).join(" ");
  const line = `${timestamp} ${formatLevel(level)} ${message}`;

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

export const logger = {
  debug: (...values: unknown[]) => write("debug", values),
  info: (...values: unknown[]) => write("info", values),
  warn: (...values: unknown[]) => write("warn", values),
  error: (...values: unknown[]) => write("error", values),
  isDebugEnabled: () => levels.debug >= levels[currentLevel()],
};

export type { LogLevel };
