import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

import {Customer, Address} from '../../models/Customer';
import ApiService from '../../services/ApiService';
import {RootStackParamList, TabParamList} from '../../../App';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Profile'>,
  StackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({navigation}) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    dateOfBirth: '',
    driversLicense: '',
  });

  useEffect(() => {
    loadCustomer();
  }, []);

  const loadCustomer = async () => {
    try {
      // For now, we'll use a test customer ID
      // In a real app, this would come from user authentication
      const customerId = '68e6b2d07f1934fa11651945';
      
      try {
        const customerData = await ApiService.getCustomer(customerId);
        setCustomer(customerData);
        populateForm(customerData);
      } catch (error) {
        // If customer doesn't exist, we'll show a form to create one
        console.log('Customer not found, showing create form');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load customer information');
      console.error('Error loading customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (customerData: Customer) => {
    setFormData({
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      email: customerData.email,
      phone: customerData.phone,
      street: customerData.address.street,
      city: customerData.address.city,
      state: customerData.address.state,
      zipCode: customerData.address.zipCode,
      country: customerData.address.country,
      dateOfBirth: customerData.dateOfBirth,
      driversLicense: customerData.driversLicense,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const customerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        dateOfBirth: formData.dateOfBirth,
        driversLicense: formData.driversLicense,
      };

      if (customer) {
        // Update existing customer
        await ApiService.updateCustomer(customer.id, customerData);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        // Create new customer
        const newCustomer = await ApiService.createCustomer(customerData);
        setCustomer(newCustomer);
        Alert.alert('Success', 'Profile created successfully');
      }
      
      setEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
      console.error('Error saving customer:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    if (customer) {
      populateForm(customer);
    }
    setEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderEditableField = (
    label: string,
    value: string,
    key: keyof typeof formData,
    placeholder: string,
    keyboardType: 'default' | 'email-address' | 'numeric' = 'default'
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {editing ? (
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={(text) => setFormData({...formData, [key]: text})}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor="#999"
        />
      ) : (
        <Text style={styles.fieldValue}>{value || 'Not provided'}</Text>
      )}
    </View>
  );

  const renderAddressSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Address</Text>
      {renderEditableField('Street', formData.street, 'street', 'Enter street address')}
      {renderEditableField('City', formData.city, 'city', 'Enter city')}
      {renderEditableField('State', formData.state, 'state', 'Enter state')}
      {renderEditableField('ZIP Code', formData.zipCode, 'zipCode', 'Enter ZIP code', 'numeric')}
      {renderEditableField('Country', formData.country, 'country', 'Enter country')}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../../assets/placeholder-avatar.png')}
              style={styles.avatar}
              defaultSource={require('../../../assets/placeholder-avatar.png')}
            />
          </View>
          <Text style={styles.userName}>
            {customer ? `${customer.firstName} ${customer.lastName}` : 'Guest User'}
          </Text>
          <Text style={styles.userEmail}>
            {customer?.email || 'No email provided'}
          </Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {!editing ? (
              <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleSave} 
                  style={[styles.saveButton, saving && styles.disabledButton]}
                  disabled={saving}>
                  <Text style={styles.saveButtonText}>
                    {saving ? 'Saving...' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          {renderEditableField('First Name', formData.firstName, 'firstName', 'Enter first name')}
          {renderEditableField('Last Name', formData.lastName, 'lastName', 'Enter last name')}
          {renderEditableField('Email', formData.email, 'email', 'Enter email address', 'email-address')}
          {renderEditableField('Phone', formData.phone, 'phone', 'Enter phone number', 'numeric')}
          {renderEditableField('Date of Birth', formData.dateOfBirth, 'dateOfBirth', 'YYYY-MM-DD')}
          {renderEditableField('Driver\'s License', formData.driversLicense, 'driversLicense', 'Enter license number')}
        </View>

        {/* Address Section */}
        {renderAddressSection()}

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Customer ID</Text>
            <Text style={styles.fieldValue}>{customer?.id || 'Not created yet'}</Text>
          </View>
          {customer && (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Member Since</Text>
              <Text style={styles.fieldValue}>
                {formatDate(customer.dateOfBirth)} {/* Using DOB as placeholder */}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Bookings')}>
            <Text style={styles.actionButtonText}>View My Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Payment History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#666',
    paddingVertical: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default ProfileScreen;
