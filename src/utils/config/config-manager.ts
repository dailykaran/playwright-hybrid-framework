import { environments } from '../../../config';
import { logger } from '../logger/logger';

export class ConfigManager {
  private environment: string;
  private config: any;

  constructor() {
    this.environment = process.env.ENVIRONMENT || 'dev';
    this.loadConfig();
  }

  /**
   * Load configuration based on environment
   */
  private loadConfig(): void {
    const env = this.environment as keyof typeof environments;
    
    if (!environments[env]) {
      logger.warn(`Environment "${this.environment}" not found. Using 'dev'`);
      this.config = environments.dev;
    } else {
      this.config = environments[env];
    }
    
    logger.info(`Loaded configuration for environment: ${this.environment}`);
  }

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return this.config.baseUrl;
  }

  /**
   * Get API base URL
   */
  getApiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  /**
   * Get timeout value
   */
  getTimeout(): number {
    return this.config.timeout;
  }

  /**
   * Check if headless mode is enabled
   */
  isHeadless(): boolean {
    return this.config.headless;
  }

  /**
   * Get slow motion value
   */
  getSlowMo(): number {
    return this.config.slowMo;
  }

  /**
   * Get screenshot setting
   */
  getScreenshot(): string {
    return this.config.screenshot;
  }

  /**
   * Get video setting
   */
  getVideo(): string {
    return this.config.video;
  }

  /**
   * Get log level
   */
  getLogLevel(): string {
    return this.config.logLevel;
  }

  /**
   * Check if debug mode is enabled
   */
  isDebugMode(): boolean {
    return this.config.isDebugMode;
  }

  /**
   * Get entire config
   */
  getConfig(): any {
    return this.config;
  }

  /**
   * Get current environment
   */
  getEnvironment(): string {
    return this.environment;
  }
}

export const configManager = new ConfigManager();
