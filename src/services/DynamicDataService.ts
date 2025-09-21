// Dynamic Data Service - Fully JSON-driven system
import masterConfig from '../config/modules.json';

// Static imports for modules and problems (required for bundling)
import slidingWindowModule from '../modules/slidingWindow/module.json';
import topologicalSortModule from '../modules/topologicalSort/module.json';

// Import essential sliding window problems (curated for pattern learning)
import p1Data from '../modules/slidingWindow/problems/p1.json'; // Maximum Sum Subarray of Size K

// Import essential topological sort problems (curated for pattern learning)
import ts1Data from '../modules/topologicalSort/problems/ts1.json'; // Topological Sort using DFS
import ts2Data from '../modules/topologicalSort/problems/ts2.json'; // Topological Sort using Kahn's Algorithm
import ts3Data from '../modules/topologicalSort/problems/ts3.json'; // Course Schedule — Cycle Detection
import ts4Data from '../modules/topologicalSort/problems/ts4.json'; // Course Schedule II — Construct Order
import ts5Data from '../modules/topologicalSort/problems/ts5.json'; // Sequence Reconstruction — Unique Order
import ts6Data from '../modules/topologicalSort/problems/ts6.json'; // Alien Dictionary — Constraint Graphs
import ts7Data from '../modules/topologicalSort/problems/ts7.json'; // Longest Path in a DAG — DP on DAG
import ts8Data from '../modules/topologicalSort/problems/ts8.json'; // Largest Color Value — Aggregation
import ts9Data from '../modules/topologicalSort/problems/ts9.json'; // Sort Items by Groups — Multi-level

// Types
export interface ProblemData {
  problemId: string;
  title: string;
  description: string;
  aim: string;
  moduleId: string;
  submoduleId: string;
  difficulty: string;
  tags: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
}

export interface ModuleConfig {
  id: string;
  internalId: string;
  name: string;
  description: string;
  difficulty: string;
  icon?: string; // Optional - not all modules need icons
  color: string;
  path: string;
  component: string;
  problemPrefix: string;
  problemCount?: number; // Optional - calculated dynamically
}

export interface ModuleData {
  moduleId: string;
  moduleName: string;
  description: string;
  submodules: any[];
}

// Static data maps (driven by JSON config)
const MODULE_DATA_MAP: Record<string, any> = {
  'slidingWindow': slidingWindowModule,
  'topological_sort': topologicalSortModule,
};

// Map internal IDs to module.json data for submodule information
const SUBMODULE_DATA_MAP: Record<string, any> = {
  'slidingWindow': slidingWindowModule,
  'topological_sort': topologicalSortModule,
};

// URL to internal key mapping for submodules
const URL_TO_INTERNAL_KEY: Record<string, string> = {
  'sliding-window': 'slidingWindow',
  'topological-sort': 'topological_sort',
};

const PROBLEM_DATA_MAP: Record<string, any> = {
  // Essential Sliding Window problems (curated for pattern mastery)
  p1: p1Data,   // Fixed Window: Maximum Sum Subarray of Size K
  
  // Essential Topological Sort problems (curated for pattern mastery)
  ts1: ts1Data, // DFS-based: Topological Sort using DFS
  ts2: ts2Data, // Kahn's: Topological Sort using Kahn's Algorithm
  ts3: ts3Data, // Kahn's: Course Schedule — Cycle Detection
  ts4: ts4Data, // Kahn's: Course Schedule II — Construct Order
  ts5: ts5Data, // Kahn's: Sequence Reconstruction — Unique Order
  ts6: ts6Data, // Kahn's: Alien Dictionary — Constraint Graphs
  ts7: ts7Data, // DFS/Kahn's: Longest Path in a DAG — DP on DAG
  ts8: ts8Data, // Kahn's: Largest Color Value — Aggregation
  ts9: ts9Data, // Kahn's: Sort Items by Groups — Multi-level
};

export class DynamicDataService {
  private static moduleConfigs: ModuleConfig[] = masterConfig.modules;

  /**
   * Get actual problem count for a module by counting available problem data
   */
  private static getActualProblemCount(moduleConfig: ModuleConfig): number {
    let count = 0;
    let i = 1;
    
    // Keep checking until we don't find a problem
    while (i <= 50) { // Reasonable upper limit to prevent infinite loops
      const problemId = `${moduleConfig.problemPrefix}${i}`;
      if (PROBLEM_DATA_MAP[problemId]) {
        count = i; // Update count to the highest found
      }
      i++;
    }
    
    return count;
  }

  /**
   * Get all available modules from master config with dynamic problem counts
   */
  static getAllModules(): ModuleConfig[] {
    return this.moduleConfigs.map(config => ({
      ...config,
      problemCount: this.getActualProblemCount(config)
    }));
  }

  /**
   * Get module config by ID (URL-friendly or internal)
   */
  static getModuleConfig(moduleId: string): ModuleConfig | null {
    return this.moduleConfigs.find(m => m.id === moduleId || m.internalId === moduleId) || null;
  }

  /**
   * Get module data by ID - uses static imports but config-driven lookup
   */
  static async getModuleData(moduleId: string): Promise<ModuleData | null> {
    const config = this.getModuleConfig(moduleId);
    if (!config) return null;

    // Use static import mapping based on config
    const data = MODULE_DATA_MAP[config.internalId];
    return data ? data as ModuleData : null;
  }

  /**
   * Get problem data by ID - uses static imports but config-driven
   */
  static async getProblemData(problemId: string): Promise<ProblemData | null> {
    const data = PROBLEM_DATA_MAP[problemId];
    return data ? data as ProblemData : null;
  }

  /**
   * Get all problems for a module - dynamically discovers all available problems
   */
  static async getModuleProblems(moduleId: string): Promise<ProblemData[]> {
    const config = this.getModuleConfig(moduleId);
    if (!config) return [];

    const problems: ProblemData[] = [];
    
    // Dynamically discover all available problems
    const actualCount = this.getActualProblemCount(config);
    for (let i = 1; i <= actualCount; i++) {
      const problemId = `${config.problemPrefix}${i}`;
      const problemData = await this.getProblemData(problemId);
      if (problemData) {
        problems.push(problemData);
      }
    }

    return problems;
  }

  /**
   * Get module config from problem ID
   */
  static getModuleConfigFromProblemId(problemId: string): ModuleConfig | null {
    return this.moduleConfigs.find(m => problemId.startsWith(m.problemPrefix)) || null;
  }

  /**
   * Get practice route for a problem
   */
  static getPlaygroundRoute(problemId: string): string | null {
    const config = this.getModuleConfigFromProblemId(problemId);
    if (!config) return null;
    
    return `/practice/${config.id}/${problemId}`;
  }

  /**
   * Get playground component name for a module
   */
  static getPlaygroundComponent(moduleId: string): string | null {
    const config = this.getModuleConfig(moduleId);
    return config ? config.component : null;
  }

  /**
   * Check if a module exists
   */
  static moduleExists(moduleId: string): boolean {
    return this.getModuleConfig(moduleId) !== null;
  }

  /**
   * Check if a problem exists
   */
  static async problemExists(problemId: string): Promise<boolean> {
    const data = await this.getProblemData(problemId);
    return data !== null;
  }

  /**
   * Get submodule data for a module (from module.json files)
   */
  static getSubmoduleData(moduleId: string): any {
    // Convert URL-friendly ID to internal ID
    const internalId = URL_TO_INTERNAL_KEY[moduleId] || moduleId;
    return SUBMODULE_DATA_MAP[internalId] || null;
  }

  /**
   * Get the display name for a module (handles URL-friendly conversion)
   */
  static getModuleDisplayName(moduleId: string): string {
    const config = this.getModuleConfig(moduleId);
    return config?.name || moduleId;
  }
}
