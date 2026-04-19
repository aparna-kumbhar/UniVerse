import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STUDENTS = [
  { id: '1', name: 'Aarav Sharma', grade: 'Class 12', avatar: '👦', enrolled: false },
  { id: '2', name: 'Priya Nair', grade: 'Class 11', avatar: '👧', enrolled: false },
  { id: '3', name: 'Rohan Mehta', grade: 'Class 12', avatar: '👦', enrolled: false },
  { id: '4', name: 'Ananya Iyer', grade: 'Class 11', avatar: '👧', enrolled: false },
  { id: '5', name: 'Karan Patel', grade: 'Class 12', avatar: '👦', enrolled: false },
  { id: '6', name: 'Sneha Reddy', grade: 'Class 11', avatar: '👧', enrolled: false },
  { id: '7', name: 'Arjun Gupta', grade: 'Class 12', avatar: '👦', enrolled: false },
  { id: '8', name: 'Nisha Verma', grade: 'Class 11', avatar: '👧', enrolled: false },
  { id: '9', name: 'Dev Kapoor', grade: 'Class 12', avatar: '👦', enrolled: false },
  { id: '10', name: 'Meera Singh', grade: 'Class 11', avatar: '👧', enrolled: false },
  { id: '11', name: 'Vikram Bose', grade: 'Class 12', avatar: '👦', enrolled: false },
  { id: '12', name: 'Kavya Joshi', grade: 'Class 11', avatar: '👧', enrolled: false },
  { id: '13', name: 'Ishaan Malhotra', grade: 'Class 12', avatar: '👦', enrolled: false },
  { id: '14', name: 'Ritika Das', grade: 'Class 11', avatar: '👧', enrolled: false },
  { id: '15', name: 'Manav Arora', grade: 'Class 12', avatar: '👦', enrolled: false },
  { id: '16', name: 'Pooja Kulkarni', grade: 'Class 11', avatar: '👧', enrolled: false },
  { id: '17', name: 'Harsh Vardhan', grade: 'Class 12', avatar: '👦', enrolled: false },
  { id: '18', name: 'Diya Sethi', grade: 'Class 11', avatar: '👧', enrolled: false },
  { id: '19', name: 'Yash Chawla', grade: 'Class 12', avatar: '👦', enrolled: false },
  { id: '20', name: 'Sana Mirza', grade: 'Class 11', avatar: '👧', enrolled: false },
  { id: '21', name: 'Aditya Suri', grade: 'Class 12', avatar: '👦', enrolled: false },
  { id: '22', name: 'Nandini Rao', grade: 'Class 11', avatar: '👧', enrolled: false },
  { id: '23', name: 'Krish Bansal', grade: 'Class 12', avatar: '👦', enrolled: false },
  { id: '24', name: 'Tanya Khanna', grade: 'Class 11', avatar: '👧', enrolled: false },
];

const FACULTY = [
  { id: 'f1', name: 'Dr. Robert Chen', subject: 'Physics HOD', exp: '15+ Yrs Exp', avatar: '👨‍🏫' },
  { id: 'f2', name: 'Prof. Sunita Rao', subject: 'Chemistry HOD', exp: '12+ Yrs Exp', avatar: '👩‍🏫' },
  { id: 'f3', name: 'Dr. Anil Kumar', subject: 'Mathematics', exp: '10+ Yrs Exp', avatar: '👨‍🏫' },
  { id: 'f4', name: 'Ms. Deepa Nair', subject: 'Biology HOD', exp: '8+ Yrs Exp', avatar: '👩‍🏫' },
  { id: 'f5', name: 'Dr. Pradeep Jain', subject: 'Physics', exp: '14+ Yrs Exp', avatar: '👨‍🏫' },
  { id: 'f6', name: 'Prof. Rekha Sharma', subject: 'Chemistry', exp: '11+ Yrs Exp', avatar: '👩‍🏫' },
  { id: 'f7', name: 'Dr. Alok Verma', subject: 'Mathematics HOD', exp: '16+ Yrs Exp', avatar: '👨‍🏫' },
  { id: 'f8', name: 'Ms. Neha Bhat', subject: 'English', exp: '9+ Yrs Exp', avatar: '👩‍🏫' },
  { id: 'f9', name: 'Prof. Ajay Tripathi', subject: 'Organic Chemistry', exp: '13+ Yrs Exp', avatar: '👨‍🏫' },
  { id: 'f10', name: 'Dr. Swati Pillai', subject: 'Botany', exp: '10+ Yrs Exp', avatar: '👩‍🏫' },
  { id: 'f11', name: 'Mr. Rahul Nanda', subject: 'Physical Chemistry', exp: '7+ Yrs Exp', avatar: '👨‍🏫' },
  { id: 'f12', name: 'Ms. Charu Anand', subject: 'Zoology', exp: '8+ Yrs Exp', avatar: '👩‍🏫' },
];

const DUMMY_BATCHES = [
  {
    id: 'b1',
    name: 'NEET Achievers 2026',
    description: 'Focused NEET prep batch with weekly mock tests and revision drills.',
    capacity: '60',
    startDate: '06/15/2024',
    type: 'Regular',
    students: [STUDENTS[0], STUDENTS[2], STUDENTS[4], STUDENTS[6], STUDENTS[8], STUDENTS[10]],
    faculty: FACULTY[0],
  },
  {
    id: 'b2',
    name: 'JEE Sprint Crash Course',
    description: 'High-intensity crash course for JEE Main and Advanced problem-solving.',
    capacity: '40',
    startDate: '07/01/2024',
    type: 'Crash Course',
    students: [STUDENTS[1], STUDENTS[3], STUDENTS[5], STUDENTS[7], STUDENTS[9], STUDENTS[11]],
    faculty: FACULTY[2],
  },
];

// ─── Student Selector Modal ───────────────────────────────────────────────────
const StudentModal = ({ visible, onClose, onConfirm, initialSelectedIds = [] }) => {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (visible) {
      setSelected(initialSelectedIds);
      setSearch('');
    }
  }, [visible, initialSelectedIds]);

  const filtered = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selectedStudents = STUDENTS.filter(s => selected.includes(s.id));
    onConfirm(selectedStudents);
    setSelected([]);
    setSearch('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, isTablet && styles.modalContainerTablet]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Select Students</Text>
              <Text style={styles.modalSubtitle}>{selected.length} selected</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search students..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            style={styles.listContainer}
            numColumns={isTablet ? 2 : 1}
            key={isTablet ? 'two-col' : 'one-col'}
            ListEmptyComponent={
              <View style={styles.emptyListState}>
                <Text style={styles.emptyListText}>No students found</Text>
              </View>
            }
            renderItem={({ item }) => {
              const isSelected = selected.includes(item.id);
              return (
                <TouchableOpacity
                  style={[
                    styles.studentRow,
                    isSelected && styles.studentRowSelected,
                    isTablet && styles.studentRowTablet,
                  ]}
                  onPress={() => toggle(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.studentAvatarWrap}>
                    <Text style={styles.avatarEmoji}>{item.avatar}</Text>
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={[styles.studentName, isSelected && styles.studentNameSelected]}>
                      {item.name}
                    </Text>
                    <Text style={styles.studentGrade}>{item.grade}</Text>
                  </View>
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, selected.length === 0 && styles.confirmBtnDisabled]}
              onPress={handleConfirm}
              disabled={selected.length === 0}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmBtnText}>
                Add {selected.length > 0 ? `(${selected.length})` : ''} Students
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Faculty Selector Modal ───────────────────────────────────────────────────
const FacultyModal = ({ visible, onClose, onSelect }) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (visible) {
      setSearch('');
    }
  }, [visible]);

  const filtered = FACULTY.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (faculty) => {
    onSelect(faculty);
    setSearch('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, isTablet && styles.modalContainerTablet]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Select Faculty</Text>
              <Text style={styles.modalSubtitle}>Choose a lead lecturer</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search faculty..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            style={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyListState}>
                <Text style={styles.emptyListText}>No faculty found</Text>
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.facultyRow}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.facultyAvatarWrap, { backgroundColor: '#E0F2FE' }]}>
                  <Text style={styles.avatarEmoji}>{item.avatar}</Text>
                </View>
                <View style={styles.facultyInfo}>
                  <Text style={styles.facultyName}>{item.name}</Text>
                  <Text style={styles.facultySubject}>{item.subject} • {item.exp}</Text>
                </View>
                <View style={styles.selectChip}>
                  <Text style={styles.selectChipText}>Select</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

// ─── Create Batch Modal ───────────────────────────────────────────────────
const CreateBatchModal = ({ visible, onClose, onConfirm, editingBatch, onStudentSelect, onFacultySelect }) => {
  const [batchName, setBatchName] = useState(editingBatch?.name || '');
  const [description, setDescription] = useState(editingBatch?.description || '');
  const [capacity, setCapacity] = useState(editingBatch?.capacity || '60');
  const [startDate, setStartDate] = useState(editingBatch?.startDate || '06/15/2024');
  const [selectedSpec, setSelectedSpec] = useState(editingBatch?.type ? [editingBatch.type] : ['Regular']);
  const [selectedStudents, setSelectedStudents] = useState(editingBatch?.students || []);
  const [selectedFaculty, setSelectedFaculty] = useState(editingBatch?.faculty || null);
  const [studentModalVisible, setStudentModalVisible] = useState(false);
  const [facultyModalVisible, setFacultyModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(600));

  useEffect(() => {
    if (!visible) return;

    setBatchName(editingBatch?.name || '');
    setDescription(editingBatch?.description || '');
    setCapacity(editingBatch?.capacity || '60');
    setStartDate(editingBatch?.startDate || '06/15/2024');
    setSelectedSpec(editingBatch?.type ? [editingBatch.type] : ['Regular']);
    setSelectedStudents(editingBatch?.students || []);
    setSelectedFaculty(editingBatch?.faculty || null);
  }, [visible, editingBatch]);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 600,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  const toggleSpec = (spec) => {
    setSelectedSpec([spec]);
  };

  const handleClose = () => {
    setStudentModalVisible(false);
    setFacultyModalVisible(false);
    onClose();
  };

  const handleConfirm = () => {
    if (!batchName.trim()) {
      alert('Please enter a batch name');
      return;
    }
    if (selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }
    if (!selectedFaculty) {
      alert('Please select a faculty member');
      return;
    }

    const batchData = {
      id: editingBatch?.id || Date.now().toString(),
      name: batchName,
      description,
      capacity,
      startDate,
      type: selectedSpec[0],
      students: selectedStudents,
      faculty: selectedFaculty,
    };

    onConfirm(batchData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setBatchName('');
    setDescription('');
    setCapacity('60');
    setStartDate('06/15/2024');
    setSelectedSpec(['Regular']);
    setSelectedStudents([]);
    setSelectedFaculty(null);
  };

  return (
    <Modal visible={visible} animationType="none" transparent>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.createBatchModalContainer,
            isTablet && styles.createBatchModalTablet,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Header */}
          <View style={styles.createBatchModalHeader}>
            <Text style={styles.createBatchModalTitle}>
              {editingBatch ? 'Edit Batch' : 'Create New Batch'}
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.createBatchScrollView} showsVerticalScrollIndicator={false}>
            {/* Batch Name */}
            <View style={styles.createBatchSection}>
              <Text style={styles.createBatchLabel}>Batch Name</Text>
              <TextInput
                style={styles.createBatchInput}
                placeholder="e.g. Excellence NEET 2024"
                placeholderTextColor="#9CA3AF"
                value={batchName}
                onChangeText={setBatchName}
              />
            </View>

            {/* Batch Type */}
            <View style={styles.createBatchSection}>
              <Text style={styles.createBatchLabel}>Batch Type</Text>
              <View style={styles.specChips}>
                {['Regular', 'Crash Course', 'Test Series', 'Workshop', 'Seminar'].map(spec => (
                  <TouchableOpacity
                    key={spec}
                    style={[styles.specChip, selectedSpec.includes(spec) && styles.specChipActive]}
                    onPress={() => toggleSpec(spec)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.specDot, selectedSpec.includes(spec) && styles.specDotActive]} />
                    <Text style={[styles.specChipText, selectedSpec.includes(spec) && styles.specChipTextActive]}>
                      {spec}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Students */}
            <View style={styles.createBatchSection}>
              <Text style={styles.createBatchLabel}>Students ({selectedStudents.length})</Text>
              <TouchableOpacity
                style={styles.selectStudentsBtn}
                onPress={() => setStudentModalVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.selectStudentsBtnIcon}>👥</Text>
                <Text style={styles.selectStudentsBtnText}>
                  {selectedStudents.length > 0
                    ? `${selectedStudents.length} Student${selectedStudents.length > 1 ? 's' : ''} Selected`
                    : 'Select Students'}
                </Text>
              </TouchableOpacity>
              {selectedStudents.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                  {selectedStudents.map(s => (
                    <TouchableOpacity
                      key={s.id}
                      style={styles.studentChip}
                      onPress={() => setSelectedStudents(prev => prev.filter(x => x.id !== s.id))}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.studentChipText}>{s.name} ✕</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Faculty */}
          
            {/* Capacity & Date */}
            <View style={styles.createBatchSection}>
              <View style={[styles.row, { gap: 12 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.createBatchLabel}>Student Capacity</Text>
                  <TextInput
                    style={styles.createBatchInput}
                    value={capacity}
                    onChangeText={setCapacity}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.createBatchLabel}>Start Date</Text>
                  <View style={styles.dateRow}>
                    <TextInput
                      style={[styles.createBatchInput, { flex: 1 }]}
                      value={startDate}
                      onChangeText={setStartDate}
                    />
                    <Text style={styles.calendarIcon}>📅</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.createBatchSection}>
              <Text style={styles.createBatchLabel}>Description</Text>
              <TextInput
                style={[styles.createBatchInput, styles.textArea]}
                placeholder="Define the primary goals and curriculum..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.createBatchModalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose} activeOpacity={0.8}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmBtnText}>
                {editingBatch ? 'Update Batch' : 'Create Batch'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      {/* External Modals */}
      <StudentModal
        visible={studentModalVisible}
        onClose={() => setStudentModalVisible(false)}
        initialSelectedIds={selectedStudents.map((student) => student.id)}
        onConfirm={(students) => setSelectedStudents(students)}
      />
      <FacultyModal
        visible={facultyModalVisible}
        onClose={() => setFacultyModalVisible(false)}
        onSelect={(faculty) => setSelectedFaculty(faculty)}
      />
    </Modal>
  );
};

// ─── Batch Card Component ─────────────────────────────────────────────────
const BatchCard = ({ batch, onEdit, onDelete }) => {
  return (
    <View style={styles.batchCard}>
      {/* Header */}
      <View style={styles.batchCardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.batchCardTitle}>{batch.name}</Text>
          <Text style={styles.batchCardSubtitle}>{batch.type}</Text>
        </View>
        <View style={styles.batchCardActions}>
          <TouchableOpacity
            style={styles.batchActionBtn}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <Text style={styles.batchActionBtnText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.batchActionBtn, styles.batchActionBtnDelete]}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.batchActionBtnText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Details Grid */}
      <View style={styles.batchCardDetails}>
        <View style={styles.batchDetailItem}>
          <Text style={styles.batchDetailLabel}>Faculty</Text>
          <View style={styles.batchDetailValue}>
            <Text style={styles.batchDetailIcon}>{batch.faculty.avatar}</Text>
            <Text style={styles.batchDetailText}>{batch.faculty.name}</Text>
          </View>
        </View>

        <View style={styles.batchDetailItem}>
          <Text style={styles.batchDetailLabel}>Students</Text>
          <Text style={styles.batchDetailText}>{batch.students.length} enrolled</Text>
        </View>

        <View style={styles.batchDetailItem}>
          <Text style={styles.batchDetailLabel}>Capacity</Text>
          <Text style={styles.batchDetailText}>{batch.capacity}</Text>
        </View>

        <View style={styles.batchDetailItem}>
          <Text style={styles.batchDetailLabel}>Start Date</Text>
          <Text style={styles.batchDetailText}>{batch.startDate}</Text>
        </View>
      </View>

      {/* Description */}
      {batch.description ? (
        <Text style={styles.batchCardDescription}>{batch.description}</Text>
      ) : null}

      {/* Students List */}
      <View style={styles.batchStudentsList}>
        <Text style={styles.batchStudentsListTitle}>Students</Text>
        <View style={styles.batchStudentsGrid}>
          {batch.students.slice(0, 6).map(student => (
            <View key={student.id} style={styles.batchStudentChip}>
              <Text style={styles.batchStudentChipText}>{student.name}</Text>
            </View>
          ))}
          {batch.students.length > 6 && (
            <View style={styles.batchStudentChip}>
              <Text style={styles.batchStudentChipText}>+{batch.students.length - 6}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Batchcreation({ navigation }) {
  const [batches, setBatches] = useState(DUMMY_BATCHES);
  const [createBatchModalVisible, setCreateBatchModalVisible] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);

  const handleCreateBatch = (batchData) => {
    if (editingBatch) {
      // Update existing batch
      setBatches(prev => prev.map(b => b.id === batchData.id ? batchData : b));
      setEditingBatch(null);
    } else {
      // Create new batch
      setBatches(prev => [...prev, batchData]);
    }
  };

  const handleEditBatch = (batch) => {
    setEditingBatch(batch);
    setCreateBatchModalVisible(true);
  };

  const handleDeleteBatch = (batchId) => {
    setBatches(prev => prev.filter(b => b.id !== batchId));
  };

  const openCreateModal = () => {
    setEditingBatch(null);
    setCreateBatchModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />


      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, isTablet && styles.scrollContentTablet]}
        showsVerticalScrollIndicator={false}
      >
        {/* Breadcrumb */}
        <Text style={styles.breadcrumb}>Admin › Batches › Management</Text>

       {/* Header Row (Title + Button) */}
<View style={styles.headerRow}>
  <View style={{ flex: 1 }}>
    <Text style={styles.pageTitle}>Manage Academic Batches</Text>
    
  </View>

  <TouchableOpacity
    style={styles.createNewBtnTop}
    onPress={openCreateModal}
    activeOpacity={0.8}
  >
    <Text style={styles.createNewBtnText}>+ Create New</Text>
  </TouchableOpacity>
</View>

        {/* Batches List */}
        {batches.length > 0 ? (
          <View style={styles.batchesList}>
            {batches.map(batch => (
              <BatchCard
                key={batch.id}
                batch={batch}
                onEdit={() => handleEditBatch(batch)}
                onDelete={() => handleDeleteBatch(batch.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📚</Text>
            <Text style={styles.emptyStateTitle}>No Batches Created</Text>
            <Text style={styles.emptyStateText}>
              Create your first batch by clicking the "Create New" button above.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Create/Edit Batch Modal */}
      <CreateBatchModal
        visible={createBatchModalVisible}
        onClose={() => {
          setCreateBatchModalVisible(false);
          setEditingBatch(null);
        }}
        onConfirm={handleCreateBatch}
        editingBatch={editingBatch}
      />
    </SafeAreaView>
  );
}


// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  // Nav
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  backArrow: { fontSize: 22, color: '#374151', paddingRight: 8 },
  navTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', flex: 1, textAlign: 'center' },
  createNewBtn: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createNewBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  scrollContentTablet: { padding: 24, maxWidth: 1100, alignSelf: 'center', width: '100%' },

  // Breadcrumb & Title
  breadcrumb: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  pageTitle: { fontSize: isTablet ? 28 : 22, fontWeight: '800', color: '#111827', marginBottom: 6 },
  pageSubtitle: { fontSize: 13, color: '#6B7280', lineHeight: 20, marginBottom: 20 },

  // Layout
  row: { flexDirection: isTablet ? 'row' : 'column', gap: 16, marginBottom: 16 },
  rowTablet: { flexDirection: 'row' },
  cardFlex1: { flex: 1 },
  cardFlex2: { flex: 2 },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateIcon: { fontSize: 64, marginBottom: 16 },
  emptyStateTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },

  // Batches List
  batchesList: { gap: 16, marginBottom: 16 },

  // Batch Card
  batchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  batchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  batchCardTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  batchCardSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  batchCardActions: { flexDirection: 'row', gap: 8 },
  batchActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  batchActionBtnDelete: { backgroundColor: '#FEE2E2' },
  batchActionBtnText: { fontSize: 16 },

  // Batch Card Details
  batchCardDetails: {
    flexDirection: isTablet ? 'row' : 'column',
    gap: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  batchDetailItem: { flex: 1, minWidth: 120 },
  batchDetailLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', marginBottom: 6, letterSpacing: 0.5 },
  batchDetailValue: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  batchDetailIcon: { fontSize: 14 },
  batchDetailText: { fontSize: 14, fontWeight: '500', color: '#111827' },
  batchCardDescription: { fontSize: 13, color: '#4B5563', lineHeight: 18, marginBottom: 14 },

  // Batch Students
  batchStudentsList: { marginTop: 12 },
  batchStudentsListTitle: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 8, letterSpacing: 0.5 },
  batchStudentsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  batchStudentChip: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  batchStudentChipText: { fontSize: 12, color: '#1D4ED8', fontWeight: '500' },

  // Create Batch Modal
  createBatchModalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  createBatchModalTablet: {
    maxWidth: 700,
    alignSelf: 'center',
    width: '90%',
    borderRadius: 20,
    marginBottom: 60,
    maxHeight: '85%',
  },
  createBatchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  createBatchModalTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  createBatchScrollView: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  createBatchSection: { marginBottom: 20 },
  createBatchLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 8, letterSpacing: 0.5 },
  createBatchInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  createBatchModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  cardGreen: { backgroundColor: '#F0FDF4' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cardIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  cardIconEmoji: { fontSize: 18 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },

  // Fields
  fieldLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', letterSpacing: 0.8, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  textArea: { height: 90, paddingTop: 10 },
  dropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: '#F9FAFB',
  },
  dropdownBtnText: { fontSize: 14, color: '#374151' },
  dropdownArrow: { fontSize: 14, color: '#6B7280' },

  dateRow: { flexDirection: 'row', alignItems: 'center' },
  calendarIcon: { fontSize: 20, marginLeft: 8 },

  // Select Students
  selectStudentsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1E3A5F',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 16,
    gap: 8,
  },
  selectStudentsBtnIcon: { fontSize: 16 },
  selectStudentsBtnText: { fontSize: 14, fontWeight: '600', color: '#1E3A5F' },
  studentChip: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  studentChipText: { fontSize: 12, color: '#1D4ED8', fontWeight: '500' },

  // Specialization
  specSubtitle: { fontSize: 13, color: '#4B5563', marginBottom: 14 },
  specChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#FFF',
    gap: 6,
  },
  specChipActive: { backgroundColor: '#1E3A5F', borderColor: '#1E3A5F' },
  specDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#9CA3AF' },
  specDotActive: { backgroundColor: '#10B981' },
  specChipText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  specChipTextActive: { color: '#FFF' },

  // Faculty
  facultySearchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: '#F9FAFB',
    gap: 8,
    marginBottom: 12,
  },
  searchIcon2: { fontSize: 16 },
  facultySearchText: { fontSize: 14, color: '#9CA3AF' },
  selectedFacultyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 10,
  },
  facultyAvatarWrapSm: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedFacultyName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  selectedFacultyMeta: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  changeBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB' },
  changeBtnText: { fontSize: 12, fontWeight: '600', color: '#374151' },

  // Actions
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },
  cancelActionBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelActionBtnText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  createBatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  createBatchBtnIcon: { fontSize: 16 },
  createBatchBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  // Notice
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    borderRadius: 10,
    padding: 14,
    gap: 10,
    marginTop: 8,
    alignItems: 'flex-start',
  },
  noticeIcon: { fontSize: 18, marginTop: 1 },
  noticeTitle: { fontSize: 13, fontWeight: '700', color: '#1E3A8A', marginBottom: 4 },
  noticeText: { fontSize: 12, color: '#374151', lineHeight: 18 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  modalContainerTablet: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '90%',
    borderRadius: 20,
    marginBottom: 60,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  modalSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { fontSize: 13, color: '#374151', fontWeight: '700' },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchIcon: { fontSize: 15 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: '#111827' },

  listContainer: { flex: 1, paddingHorizontal: 12 },
  emptyListState: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },

  studentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    margin: 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 10,
  },
  studentRowSelected: { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' },
  studentRowTablet: { flex: undefined, width: '47%' },
  studentAvatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 20 },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  studentNameSelected: { color: '#1D4ED8' },
  studentGrade: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: '#1E3A5F', borderColor: '#1E3A5F' },
  checkmark: { color: '#FFF', fontSize: 13, fontWeight: '700' },

  facultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginVertical: 4,
    marginHorizontal: 4,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  facultyAvatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facultyInfo: { flex: 1 },
  facultyName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  facultySubject: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  selectChip: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  selectChipText: { fontSize: 12, fontWeight: '700', color: '#FFF' },

  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  confirmBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#1E3A5F',
    alignItems: 'center',
  },
  confirmBtnDisabled: { backgroundColor: '#9CA3AF' },
  confirmBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  headerRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: 20,
  gap: 12,
},

createNewBtnTop: {
  backgroundColor: '#1E3A5F',
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 8,
  alignSelf: 'flex-start',
},
});