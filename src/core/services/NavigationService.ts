import { router } from 'expo-router';

// Navigation mapping for proper back button functionality
export class NavigationService {
  // Define the navigation hierarchy and back routes
  private static readonly ROUTE_HIERARCHY: Record<string, string | null> = {
    // Practice routes (formerly playground)
    '/practice/sliding-window/': '/module/sliding-window',
    '/practice/topological-sort/': '/module/topological-sort',
    
    // Problem routes  
    '/problem/': '/module/', // Will be determined by problem's module
    
    // Module routes
    '/module/sliding-window': '/home',
    '/module/topological-sort': '/home',
    '/module/': '/home',
    
    // Home and other routes
    '/home': '/',
    '/': null, // Root, no back
  };

  // Get the appropriate back route for current path
  public static getBackRoute(currentPath: string): string | null {
    // Handle dynamic routes with IDs
    for (const [pattern, backRoute] of Object.entries(this.ROUTE_HIERARCHY)) {
      if (currentPath.startsWith(pattern)) {
        return backRoute;
      }
    }
    
    // Fallback to generic back
    return null;
  }

  // Enhanced back navigation with proper URL mapping
  public static goBack(currentPath?: string): void {
    try {
      if (currentPath) {
        const backRoute = this.getBackRoute(currentPath);
        if (backRoute) {
          console.log(`Navigating back from ${currentPath} to ${backRoute}`);
          router.push(backRoute as any);
          return;
        }
      }
      
      // Fallback to router.back() if no specific route found
      if (router.canGoBack()) {
        console.log('Using router.back()');
        router.back();
      } else {
        // If can't go back (direct link), go to home
        console.log('Cannot go back, redirecting to home');
        router.push('/home' as any);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Ultimate fallback to home
      router.push('/home' as any);
    }
  }

  // Get back route for problem based on its module
  public static getBackRouteForProblem(problemId: string): string {
    // This would integrate with DynamicDataService to get the module
    // For now, we'll implement a simple mapping
    
    // Sliding window problems (p1-p12)
    if (problemId.startsWith('p') && /^p\d+$/.test(problemId)) {
      return '/module/sliding-window';
    }
    
    // Topological sort problems (ts1-ts9)
    if (problemId.startsWith('ts') && /^ts\d+$/.test(problemId)) {
      return '/module/topological-sort';
    }
    
    // Default fallback
    return '/home';
  }

  // Get back route for playground based on module and problem
  public static getBackRouteForPlayground(moduleId: string, problemId: string): string {
    return `/module/${moduleId}`;
  }

  // Enhanced navigation for specific contexts
  public static navigateBackFromProblem(problemId: string): void {
    const backRoute = this.getBackRouteForProblem(problemId);
    console.log(`Navigating back from problem ${problemId} to ${backRoute}`);
    router.push(backRoute as any);
  }

  public static navigateBackFromPlayground(moduleId: string, problemId: string): void {
    const backRoute = this.getBackRouteForPlayground(moduleId, problemId);
    console.log(`Navigating back from playground ${moduleId}/${problemId} to ${backRoute}`);
    router.push(backRoute as any);
  }

  public static navigateBackFromModule(moduleId: string): void {
    console.log(`Navigating back from module ${moduleId} to /home`);
    router.push('/home' as any);
  }
}

export default NavigationService;
