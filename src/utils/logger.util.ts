type LogLevel = 'info' | 'warning' | 'error';
type LogMethod = (message: string, props?: unknown) => void;

interface LoggerOptions {
  includeTimestamp?: boolean;
  prettyPrint?: boolean;
}

class Logger {
  private readonly levelEmojis = {
    info: ' 🟩 ',
    warning: ' 🟨 ',
    error: ' 🟥 ',
  };

  private readonly levelLabels = {
    info: 'INFO',
    warning: 'WARNING',
    error: 'ERROR',
  };

  constructor(private readonly options: LoggerOptions = {}) {
    this.options = {
      includeTimestamp: true,
      prettyPrint: false,
      ...options,
    };
  }

  public info: LogMethod = (message, props) => {
    this.log('info', message, props);
  };

  public warning: LogMethod = (message, props) => {
    this.log('warning', message, props);
  };

  public error: LogMethod = (message, props) => {
    this.log('error', message, props);
  };

  private log(level: LogLevel, message: string, props?: unknown): void {
    const timestamp = this.options.includeTimestamp
      ? `[${new Date().toISOString()}] `
      : '';
    const levelTag = `${this.levelEmojis[level]}${this.levelLabels[level]}${this.levelEmojis[level]}`;

    console.log(`${timestamp}logger [${levelTag}]: ${message}`);

    if (props) {
      const formattedProps = this.options.prettyPrint
        ? JSON.stringify(props, null, 2)
        : JSON.stringify(props);
      console.log(`[PROPS]: ${formattedProps}\n`);
    }
  }
}

const logger = new Logger({
  includeTimestamp: true,
  prettyPrint: true,
});

export default logger;
