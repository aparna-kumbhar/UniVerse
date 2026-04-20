import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Animated,
  PanResponder,
  Alert,
  NativeModules,
} from 'react-native';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const Stack = createNativeStackNavigator();

const KNOWN_LAN_FALLBACKS = ['http://192.168.137.215:5000'];

const resolveWebBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:5000`;
  }
  return 'http://localhost:5000';
};

const resolveDevHost = () => {
  const scriptURL = NativeModules?.SourceCode?.scriptURL || '';
  if (!scriptURL) return '';

  try {
    return new URL(scriptURL).hostname || '';
  } catch (error) {
    const match = scriptURL.match(/https?:\/\/([^/:]+)/i);
    return match?.[1] || '';
  }
};

const resolveExpoHost = () => {
  const hostUri =
    Constants?.expoConfig?.hostUri ||
    Constants?.manifest2?.extra?.expoClient?.hostUri ||
    Constants?.manifest?.debuggerHost ||
    '';

  if (!hostUri) return '';
  return String(hostUri).split(':')[0] || '';
};

const getApiBaseUrls = () => {
  const urls = [];
  const add = (url) => {
    if (url && !urls.includes(url)) {
      urls.push(url);
    }
  };

  const expoHost = resolveExpoHost();
  const devHost = resolveDevHost();

  if (Platform.OS === 'web') {
    add(resolveWebBaseUrl());
    add('http://localhost:5000');
    add('http://127.0.0.1:5000');
    return urls;
  }

  if (expoHost && expoHost !== 'localhost' && expoHost !== '127.0.0.1') {
    add(`http://${expoHost}:5000`);
  }

  if (devHost && devHost !== 'localhost' && devHost !== '127.0.0.1') {
    add(`http://${devHost}:5000`);
  }

  if (Platform.OS === 'android') {
    add('http://10.0.2.2:5000');
  }

  KNOWN_LAN_FALLBACKS.forEach(add);
  add('http://localhost:5000');
  add('http://127.0.0.1:5000');
  return urls;
};

const API_BASE_URLS = getApiBaseUrls();

const fetchWithBaseUrlFallback = async (path, options = {}) => {
  let lastError;

  for (const baseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`, options);
      return { response, baseUrl };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Could not reach backend server');
};

const normalizeBatchFromApi = (batch) => {
  const created = batch?.createdAt ? new Date(batch.createdAt) : new Date();
  const safeDate = Number.isNaN(created.getTime()) ? new Date() : created;
  const studentCount = Array.isArray(batch?.students) ? batch.students.length : 0;
  const code = (batch?.name || batch?.type || 'BATCH')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'BT';

  return {
    id: batch?._id || batch?.id || Date.now().toString(),
    code,
    name: batch?.name || 'Unnamed Batch',
    subject: batch?.description || batch?.type || 'Batch',
    icon: '📚',
    students: studentCount,
    allotmentStatus: Math.min(100, Math.max(0, Math.round((studentCount / Math.max(Number(batch?.capacity) || 1, 1)) * 100))),
    color: '#FFFFFF',
    createdAt: safeDate,
    batchStudents: Array.isArray(batch?.students) ? batch.students : [],
  };
};

// ─── Teachers Data ────────────────────────────────────────────────────────────────
const TEACHERS = [
  { id: '1', name: 'Dr. Robert Chen', subject: 'Advanced Mathematics', status: 'Available' },
  { id: '2', name: 'Prof. Sunita Rao', subject: 'Organic Chemistry', status: 'Available' },
  { id: '3', name: 'Dr. Anil Kumar', subject: 'World History', status: 'Available' },
  { id: '4', name: 'Ms. Priya Verma', subject: 'English Literature', status: 'Busy' },
  { id: '5', name: 'Mr. Rajesh Singh', subject: 'Computer Science', status: 'Available' },
  { id: '6', name: 'Dr. Meera Patel', subject: 'Physics', status: 'Available' },
  { id: '7', name: 'Prof. Vikram Nair', subject: 'Biology', status: 'Available' },
  { id: '8', name: 'Ms. Anjali Desai', subject: 'Economics', status: 'Available' },
];

// ─── Teacher Selection Modal Component ─────────────────────────────────────────
const TeacherSelectionModal = ({ visible, onClose, onSelectTeacher, currentTeacher }) => {
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const panResponder = useRef(null);

  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) {
          // Drag down more than 100px - close modal
          Animated.timing(slideAnim, {
            toValue: Dimensions.get('window').height,
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            onClose();
            slideAnim.setValue(0);
          });
        } else {
          // Snap back to top
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      },
    });
  }, []);

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(0);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  const renderTeacherItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.teacherItem,
        currentTeacher?.id === item.id && styles.teacherItemSelected,
      ]}
      onPress={() => {
        onSelectTeacher(item);
        onClose();
      }}
      activeOpacity={0.7}
    >
      <View style={styles.teacherAvatar}>
        <Text style={styles.teacherAvatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.teacherInfo}>
        <Text style={styles.teacherName}>{item.name}</Text>
        <Text style={styles.teacherSubject}>{item.subject}</Text>
      </View>
      <View style={[styles.statusBadge, item.status === 'Available' ? styles.statusAvailable : styles.statusBusy]}>
        <Text style={styles.statusBadgeText}>{item.status}</Text>
      </View>
      {currentTeacher?.id === item.id && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
          {...panResponder.current?.panHandlers}
        >
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Select Teacher</Text>
          <Text style={styles.dragHint}>👆 Drag to scroll or close</Text>
          <FlatList
            data={TEACHERS}
            renderItem={renderTeacherItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            maxHeight={500}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};


const BatchCard = ({ batch, onManagePress }) => {
  return (
    <View style={[styles.batchCard, { backgroundColor: batch.color }]}>
      {/* Left Badge */}
      <View style={styles.batchBadge}>
        <Text style={styles.batchCode}>{batch.code}</Text>
      </View>

      {/* Middle Content */}
      <View style={styles.batchContent}>
        <Text style={styles.batchName}>{batch.name}</Text>
        <View style={styles.batchMeta}>
          <Text style={styles.batchIcon}>{batch.icon}</Text>
          <Text style={styles.batchSubject}>{batch.subject}</Text>
          <Text style={styles.batchSeparator}>•</Text>
          <Text style={styles.batchStudents}>👥 {batch.students} Students</Text>
        </View>

        {/* Allotment Status */}
        <View style={styles.allotmentSection}>
          <Text style={styles.allotmentLabel}>ALLOTMENT STATUS</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${batch.allotmentStatus}%` },
              ]}
            />
          </View>
          <Text style={styles.allotmentPercent}>{batch.allotmentStatus}%</Text>
        </View>
      </View>

      {/* Right Button */}
      <TouchableOpacity
        style={styles.manageBtn}
        onPress={() => onManagePress(batch)}
        activeOpacity={0.8}
      >
        <Text style={styles.manageBtnText}>Manage{'\n'}Allotment</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Batch Selection Screen ───────────────────────────────────────────────
const BatchSelectionScreen = ({ navigation, instituteId }) => {
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);

  useEffect(() => {
    const loadBatches = async () => {
      const resolvedInstituteId = (instituteId || '').trim();
      if (!resolvedInstituteId) {
        setFilteredBatches([]);
        return;
      }

      try {
        const { response } = await fetchWithBaseUrlFallback(
          `/api/batches?instituteId=${encodeURIComponent(resolvedInstituteId)}`
        );
        const payload = await response.json();

        if (!response.ok) {
          Alert.alert('Failed to load batches', payload?.message || 'Unable to fetch batches');
          return;
        }

        setFilteredBatches(Array.isArray(payload) ? payload.map(normalizeBatchFromApi) : []);
      } catch (error) {
        Alert.alert('Network error', 'Could not load batches from the backend.');
      }
    };

    loadBatches();
  }, [instituteId]);

  const handleManageAllotment = (batch) => {
    navigation.navigate('ManageAllotment', {
      batchId: batch.id,
      batchName: batch.name,
      batchCode: batch.code,
      students: batch.batchStudents || [],
      instituteId,
    });
  };

  const handleCreateNewBatch = () => {
    // You can add navigation to batch creation if needed
    alert('Navigate to Batch Creation');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Header */}
     

      {/* Navigation Tabs */}
     

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Header */}
       
          <View>
            <Text style={styles.sectionTitle}>Select Batch</Text>
         
        </View>

        {/* Batch Cards List */}
        <View style={styles.batchesList}>
          {filteredBatches.map(batch => (
            <BatchCard
              key={batch.id}
              batch={batch}
              onManagePress={handleManageAllotment}
            />
          ))}
        </View>

        {/* View Archived Batches */}
      

      </ScrollView>

      {/* Floating Create Button */}
      

      {/* Desktop Create Button */}
      {isTablet && (
        <View style={styles.desktopCreateBtn}>
          <TouchableOpacity
            style={styles.createBtnLarge}
            onPress={handleCreateNewBatch}
            activeOpacity={0.8}
          >
            <Text style={styles.createBtnText}>+ Create New Batch</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

// ─── Manage Allotment Screen ──────────────────────────────────────────────
const ManageAllotmentScreen = ({ navigation, route }) => {
  const { batchName, batchCode, students, instituteId } = route.params || {};
  const [teachers, setTeachers] = useState(TEACHERS);
  const [allocatedTeachers, setAllocatedTeachers] = useState([
    { id: '1', name: 'Dr. Robert Chen', subject: 'Advanced Mathematics', status: 'Allocated' },
    { id: '2', name: 'Prof. Sunita Rao', subject: 'Organic Chemistry', status: 'Allocated' },
  ]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const panResponder = useRef(null);

  // Get unique subjects
  const uniqueSubjects = [...new Set(teachers.map(t => t.subject))];

  // Filter teachers based on selected subjects
  const filteredTeachers = selectedSubjects.length === 0 
    ? teachers 
    : teachers.filter(t => selectedSubjects.includes(t.subject));

  useEffect(() => {
    const loadTeachers = async () => {
      const resolvedInstituteId = (instituteId || '').trim();
      if (!resolvedInstituteId) {
        return;
      }

      try {
        const { response } = await fetchWithBaseUrlFallback(
          `/api/teachers?instituteId=${encodeURIComponent(resolvedInstituteId)}`
        );
        const payload = await response.json();

        if (!response.ok) {
          return;
        }

        const mapped = Array.isArray(payload)
          ? payload.map((teacher, index) => ({
              id: teacher?.teacherId || teacher?._id || `t-${index}`,
              name: teacher?.fullName || 'Teacher',
              subject: teacher?.departmentName || teacher?.qualification || 'General',
              status: 'Available',
            }))
          : [];

        setTeachers(mapped);
      } catch (error) {
        // Keep local fallback teachers if backend is unreachable.
      }
    };

    loadTeachers();
  }, [instituteId]);

  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        slideAnim.setValue(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 150) {
          // Drag down more than 150px - close drawer
          Animated.timing(slideAnim, {
            toValue: Dimensions.get('window').height,
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            setShowDrawer(false);
          });
        } else if (gestureState.dy < -100) {
          // Drag up more than 100px - expand to top
          Animated.timing(slideAnim, {
            toValue: -Dimensions.get('window').height * 0.5,
            duration: 300,
            useNativeDriver: false,
          }).start();
        } else {
          // Snap back to default position
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      },
    });
  }, []);

  const handleSubjectToggle = (subject) => {
    const isSelected = selectedSubjects.includes(subject);
    
    if (isSelected) {
      // Deselecting subject
      const newSubjects = selectedSubjects.filter(s => s !== subject);
      setSelectedSubjects(newSubjects);
      
      // Close drawer if no subjects selected
      if (newSubjects.length === 0) {
        Animated.timing(slideAnim, {
          toValue: Dimensions.get('window').height,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          setShowDrawer(false);
        });
      }
    } else {
      // Selecting subject
      setSelectedSubjects([...selectedSubjects, subject]);
      setShowDrawer(true);
      
      // Open drawer with animation
      slideAnim.setValue(Dimensions.get('window').height);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleTeacherSelect = (teacher) => {
    const isAllocated = allocatedTeachers.some(t => t.id === teacher.id);
    if (isAllocated) {
      setAllocatedTeachers(prev => prev.filter(t => t.id !== teacher.id));
    } else {
      setAllocatedTeachers(prev => [...prev, { ...teacher, status: 'Allocated' }]);
    }
  };

  const renderTeacherItem = ({ item }) => {
    const isAllocated = allocatedTeachers.some(t => t.id === item.id);
    return (
      <TouchableOpacity
        style={[
          styles.teacherItemAlloc,
          isAllocated && styles.teacherItemAllocSelected,
        ]}
        onPress={() => handleTeacherSelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.teacherAvatar}>
          <Text style={styles.teacherAvatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherName}>{item.name}</Text>
          <Text style={styles.teacherSubject}>{item.subject}</Text>
        </View>
        <View style={[styles.statusBadge, item.status === 'Available' ? styles.statusAvailable : styles.statusBusy]}>
          <Text style={styles.statusBadgeText}>{item.status}</Text>
        </View>
        {isAllocated && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Header */}
      <View style={styles.manageHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.manageTitle}>Allocate Teachers</Text>
          <Text style={styles.manageBatchInfo}>
            {batchCode} • {batchName}
          </Text>
        </View>
      </View>

      <View style={styles.allocStatsContainer}>
        
      </View>

      {/* Subject Filter */}
      <View style={styles.subjectFilterContainer}>
        <Text style={styles.filterLabel}>Filter by Subject:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectScrollView}>
          {uniqueSubjects.map((subject) => {
            const isSelected = selectedSubjects.includes(subject);
            return (
              <TouchableOpacity
                key={subject}
                style={[
                  styles.subjectToggleBtn,
                  isSelected && styles.subjectToggleBtnActive,
                ]}
                onPress={() => handleSubjectToggle(subject)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.subjectToggleBtnText,
                    isSelected && styles.subjectToggleBtnTextActive,
                  ]}
                >
                  {subject}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Teacher List Drawer - Only shown when subject is selected */}
      {showDrawer && (
        <Animated.View
          style={[
            styles.teacherDrawer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
          {...panResponder.current?.panHandlers}
        >
          <View style={styles.drawerHandle} />
          <Text style={styles.drawerTitle}>Select Teachers</Text>
          <Text style={styles.dragHint}>👆 Drag up to expand, down to close</Text>
          
          <FlatList
            data={filteredTeachers}
            renderItem={renderTeacherItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            style={styles.teacherFlatList}
          />
        </Animated.View>
      )}

      {/* Allocated Teachers Summary */}
      {allocatedTeachers.length > 0 && (
        <View style={styles.allocatedSummary}>
          <Text style={styles.allocatedSummaryTitle}>Allocated Teachers:</Text>
          <View style={styles.allocatedTeachersList}>
            {allocatedTeachers.map((teacher) => (
              <View key={teacher.id} style={styles.allocatedTeacherBadge}>
                <Text style={styles.allocatedTeacherText}>{teacher.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

// ─── Navigation Setup ─────────────────────────────────────────────────────
export function BatchSelectionStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFF' },
      }}
    >
      <Stack.Screen name="BatchSelection" component={BatchSelectionScreen} />
      <Stack.Screen name="ManageAllotment" component={ManageAllotmentScreen} />
    </Stack.Navigator>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────
export function BatchSelectionStackWithInstitute({ instituteId }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFF' },
      }}
    >
      <Stack.Screen name="BatchSelection">
        {(props) => <BatchSelectionScreen {...props} instituteId={instituteId} />}
      </Stack.Screen>
      <Stack.Screen name="ManageAllotment" component={ManageAllotmentScreen} />
    </Stack.Navigator>
  );
}

export default function Batchselection({ instituteId }) {
  return <BatchSelectionStackWithInstitute instituteId={instituteId} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    fontSize: 32,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  tagline: {
    fontSize: 10,
    color: '#999',
    letterSpacing: 1,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 20,
    opacity: 0.8,
  },
  settingsIcon: {
    fontSize: 20,
    opacity: 0.8,
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },

  // Navigation Tabs
  navTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    gap: 24,
  },
  navTab: {
    fontSize: 13,
    color: '#666',
    paddingVertical: 12,
    fontWeight: '500',
  },
  navTabActive: {
    color: '#1E3A5F',
    borderBottomWidth: 2,
    borderBottomColor: '#1E3A5F',
    paddingBottom: 10,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  scrollContentTablet: {
    padding: 24,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },

  // Section Header
  sectionHeader: {
    marginBottom: 24,
    flexDirection: isTablet ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: isTablet ? 'flex-start' : 'flex-start',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0066CC',
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    maxWidth: 500,
  },
  filterSort: {
    flexDirection: 'row',
    gap: 12,
    marginTop: isTablet ? 0 : 16,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  // Batch Cards
  batchesList: {
    gap: 12,
    marginBottom: 16,
  },
 batchCard: {
  flexDirection: 'row',
  alignItems: 'flex-start', // 👈 change from center
  borderRadius: 12,
  padding: 16,
  gap: 16,
  position: 'relative', // 👈 important for absolute button
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
  }),
},
  batchBadge: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  batchCode: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  batchContent: {
  flex: 1,
  paddingRight: 90, // 👈 space for button
},
  batchName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  batchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  batchIcon: {
    fontSize: 14,
  },
  batchSubject: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  batchSeparator: {
    color: '#CCC',
  },
  batchStudents: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  allotmentSection: {
    marginTop: 8,
  },
  allotmentLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0066CC',
    borderRadius: 3,
  },
  allotmentPercent: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555',
  },
  manageBtn: {
  position: 'absolute',   // 👈 key change
  bottom: 12,
  right: 12,
  backgroundColor: '#1E3A5F',
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
},
  manageBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },

  // Archived Link
  archivedLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  archivedLinkText: {
    fontSize: 13,
    color: '#0066CC',
    fontWeight: '600',
  },
  archivedLinkArrow: {
    fontSize: 14,
    color: '#0066CC',
  },

  // Floating Button
  floatingBtn: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#1E3A5F',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: { elevation: 5 },
    }),
  },
  floatingBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },

  // Desktop Create Button
  desktopCreateBtn: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  createBtnLarge: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  createBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },

  // Manage Allotment Screen
  manageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    gap: 12,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  manageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  manageBatchInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },

  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: { elevation: 1 },
    }),
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },

  // Allotment List
  allotmentListContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  allotmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  allotmentInfo: {
    flex: 1,
  },
  studentNameInList: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  allotmentMeta: {
    fontSize: 11,
    color: '#999',
  },
  allotmentStatus: {
    marginHorizontal: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  statusAssigned: {
    backgroundColor: '#D4EDDA',
  },
  statusPending: {
    backgroundColor: '#FFF3CD',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  allotmentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionIcon: {
    fontSize: 16,
    paddingHorizontal: 8,
  },

  // Add Allotment Button
  addAllotmentBtn: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1E3A5F',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addAllotmentBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },

  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: Dimensions.get('window').height * 0.75,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#CCC',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dragHint: {
    fontSize: 12,
    color: '#999',
    paddingHorizontal: 16,
    marginBottom: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  teacherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  teacherItemSelected: {
    backgroundColor: '#E8F4F8',
  },
  teacherAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teacherAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  teacherSubject: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  statusAvailable: {
    backgroundColor: '#D4EDDA',
  },
  statusBusy: {
    backgroundColor: '#FFE0E0',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  checkmark: {
    fontSize: 18,
    color: '#0066CC',
    fontWeight: '700',
  },

  // Teacher Allocation Styles
  allocStatsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  allocStatBox: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: { elevation: 1 },
    }),
  },
  allocStatNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  allocStatLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  teacherDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: Dimensions.get('window').height * 0.7,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 10 },
    }),
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#CCC',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  teacherFlatList: {
    paddingHorizontal: 0,
  },
  teacherItemAlloc: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  teacherItemAllocSelected: {
    backgroundColor: '#E8F4F8',
  },
  allocatedSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  allocatedSummaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  allocatedTeachersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allocatedTeacherBadge: {
    backgroundColor: '#E8F4F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0066CC',
  },
  allocatedTeacherText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0066CC',
  },

  // Subject Filter Styles
  subjectFilterContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  subjectScrollView: {
    flexDirection: 'row',
  },
  subjectToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  subjectToggleBtnActive: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
  },
  subjectToggleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  subjectToggleBtnTextActive: {
    color: '#FFF',
  },
});