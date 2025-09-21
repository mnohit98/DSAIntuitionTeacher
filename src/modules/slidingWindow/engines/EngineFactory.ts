import { BaseEngine } from './BaseEngine';
import { FixedSizeEngine } from './FixedSizeEngine';

export class EngineFactory {
  static createEngine(submoduleId: string, problemData: any): BaseEngine {
    switch (submoduleId) {
      case 'sw_fixed':
        return new FixedSizeEngine(problemData);
      default:
        throw new Error(`Unknown submodule: ${submoduleId}`);
    }
  }
}
