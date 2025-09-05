import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../src/contexts/ThemeContext';
import SlidingWindowPlayground from '../../../src/modules/slidingWindow/components/SlidingWindowPlayground';

// Import problem data
import p1Data from '../../../src/modules/slidingWindow/problems/p1.json';
import p10Data from '../../../src/modules/slidingWindow/problems/p10.json';
import p11Data from '../../../src/modules/slidingWindow/problems/p11.json';
import p12Data from '../../../src/modules/slidingWindow/problems/p12.json';
import p13Data from '../../../src/modules/slidingWindow/problems/p13.json';
import p14Data from '../../../src/modules/slidingWindow/problems/p14.json';
import p15Data from '../../../src/modules/slidingWindow/problems/p15.json';
import p16Data from '../../../src/modules/slidingWindow/problems/p16.json';
import p17Data from '../../../src/modules/slidingWindow/problems/p17.json';
import p2Data from '../../../src/modules/slidingWindow/problems/p2.json';
import p3Data from '../../../src/modules/slidingWindow/problems/p3.json';
import p4Data from '../../../src/modules/slidingWindow/problems/p4.json';
import p5Data from '../../../src/modules/slidingWindow/problems/p5.json';
import p6Data from '../../../src/modules/slidingWindow/problems/p6.json';
import p7Data from '../../../src/modules/slidingWindow/problems/p7.json';
import p8Data from '../../../src/modules/slidingWindow/problems/p8.json';
import p9Data from '../../../src/modules/slidingWindow/problems/p9.json';

export default function PlaygroundScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  
  // Set document title for web
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Sliding Window Playground';
    }
  }, []);

  // Get problem data based on ID
  const getProblemData = (problemId: string) => {
    switch (problemId) {
      case 'p1':
        return p1Data;
      case 'p2':
        return p2Data;
      case 'p3':
        return p3Data;
      case 'p4':
        return p4Data;
      case 'p5':
        return p5Data;
      case 'p6':
        return p6Data;
      case 'p7':
        return p7Data;
      case 'p8':
        return p8Data;
      case 'p9':
        return p9Data;
      case 'p10':
        return p10Data;
      case 'p11':
        return p11Data;
      case 'p12':
        return p12Data;
      case 'p13':
        return p13Data;
      case 'p14':
        return p14Data;
      case 'p15':
        return p15Data;
      case 'p16':
        return p16Data;
      case 'p17':
        return p17Data;
      default:
        return p1Data; // Default fallback
    }
  };

  const problemData = getProblemData(id as string);

  return (
    <View style={styles.container}>
      <SlidingWindowPlayground problemData={problemData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080A0D',
  },
});
