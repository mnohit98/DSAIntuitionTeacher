import { ModuleConfiguration, Variable } from '../types/engine';

// Import JSON configurations
import slidingWindowConfig from '../../modules/slidingWindow/config.json';
import topologicalSortConfig from '../../modules/topologicalSort/config.json';

class ConfigService {
  private static instance: ConfigService;
  private configurations: Map<string, ModuleConfiguration> = new Map();

  private constructor() {
    // Load all module configurations
    this.configurations.set('sliding-window', slidingWindowConfig as unknown as ModuleConfiguration);
    this.configurations.set('topological-sort', topologicalSortConfig as unknown as ModuleConfiguration);
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public getModuleConfiguration(moduleId: string): ModuleConfiguration | null {
    return this.configurations.get(moduleId) || null;
  }

  public getAllModuleIds(): string[] {
    return Array.from(this.configurations.keys());
  }

  public extractVariablesFromState(moduleId: string, engineState: any, problemData?: any): Variable[] {
    const config = this.getModuleConfiguration(moduleId);
    if (!config || !config.engine.variableExtractors) {
      return [];
    }

    const variables: Variable[] = [];
    const context = { ...engineState, problemData };

    for (const extractor of config.engine.variableExtractors) {
      try {
        const value = this.extractValueByPath(context, extractor.path);
        const formattedValue = this.formatValue(value, extractor.formatter);

        variables.push({
          name: extractor.name,
          value: formattedValue,
          description: extractor.description,
          type: extractor.type
        });
      } catch (error) {
        console.warn(`Failed to extract variable ${extractor.name}:`, error);
        // Add default value for failed extractions
        variables.push({
          name: extractor.name,
          value: 'N/A',
          description: extractor.description,
          type: extractor.type
        });
      }
    }

    return variables;
  }

  private extractValueByPath(obj: any, path: string): any {
    // Simple JSONPath implementation for basic paths like $.uiState.windowSum
    if (path.startsWith('$.')) {
      const cleanPath = path.substring(2); // Remove '$.'
      const parts = cleanPath.split('.');
      
      let current = obj;
      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          return undefined;
        }
      }
      return current;
    }
    return undefined;
  }

  private formatValue(value: any, formatter?: string): any {
    if (value === undefined || value === null) {
      return 'N/A';
    }

    switch (formatter) {
      case 'countKeys':
        return typeof value === 'object' ? Object.keys(value).length : 0;
      
      case 'jsonStringify':
        return typeof value === 'object' ? JSON.stringify(value) : String(value);
      
      case 'arrayLength':
        return Array.isArray(value) ? value.length : 0;
      
      case 'arrayJoin':
        return Array.isArray(value) ? value.join(', ') : String(value);
      
      default:
        return value;
    }
  }

  public registerModule(moduleId: string, config: ModuleConfiguration): void {
    this.configurations.set(moduleId, config);
  }

  public updateModuleConfiguration(moduleId: string, updates: Partial<ModuleConfiguration>): void {
    const existing = this.configurations.get(moduleId);
    if (existing) {
      this.configurations.set(moduleId, { ...existing, ...updates });
    }
  }
}

export default ConfigService;
