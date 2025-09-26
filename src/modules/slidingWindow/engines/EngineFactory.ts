import { AdvancedEngine } from './AdvancedEngine';
import { BaseEngine } from './BaseEngine';
import { FixedSizeEngine } from './FixedSizeEngine';
import { VariableSizeEngine } from './VariableSizeEngine';

export class EngineFactory {
  static createEngine(submoduleId: string, problemData: any): BaseEngine {
    switch (submoduleId) {
      case 'sw_fixed':
        return new FixedSizeEngine(problemData);
      case 'sw_variable':
        return new VariableSizeEngine(problemData);
      case 'sw_advanced':
        return new AdvancedEngine(problemData);
      default:
        throw new Error(`Unknown submodule: ${submoduleId}`);
    }
  }
}
