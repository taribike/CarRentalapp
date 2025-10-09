import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import {Car} from '../../models/Car';
import {RootStackParamList} from '../../../App';
import ApiService from '../../services/ApiService';

type CarDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CarDetails'
>;

type CarDetailsScreenRouteProp = RouteProp<RootStackParamList, 'CarDetails'>;

interface Props {
  navigation: CarDetailsScreenNavigationProp;
  route: CarDetailsScreenRouteProp;
}

const CarDetailsScreen: React.FC<Props> = ({navigation, route}) => {
  const {car} = route.params;
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateTotalDays = () => {
    if (!pickupDate || !returnDate) return 0;
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const diffTime = returnD.getTime() - pickup.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalAmount = () => {
    const days = calculateTotalDays();
    return days * car.dailyRate;
  };

  const handleBookNow = async () => {
    if (!pickupDate || !returnDate || !pickupLocation || !returnLocation) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (calculateTotalDays() <= 0) {
      Alert.alert('Error', 'Return date must be after pickup date');
      return;
    }

    setLoading(true);
    try {
      // For now, we'll use a test customer ID
      // In a real app, this would come from user authentication
      const customerId = '68e6b2d07f1934fa11651945';

      const bookingRequest = {
        customerId,
        carId: car.id,
        pickupDate,
        returnDate,
        pickupLocation,
        returnLocation,
        notes: `Booking for ${car.year} ${car.make} ${car.model}`,
      };

      const booking = await ApiService.createBooking(bookingRequest);
      
      Alert.alert(
        'Booking Created!',
        'Your booking has been created successfully. Proceed to payment?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Pay Now',
            onPress: () => navigation.navigate('Payment', {booking}),
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking');
      console.error('Error creating booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={
          car.imageUrl
            ? {uri: car.imageUrl}
            : require('../../../assets/placeholder-car.png')
        }
        style={styles.carImage}
        defaultSource={require('../../../assets/placeholder-car.png')}
      />

      <View style={styles.content}>
        <Text style={styles.carTitle}>
          {car.year} {car.make} {car.model}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.dailyRate}>${car.dailyRate}/day</Text>
          <Text style={styles.available}>
            {car.isAvailable ? 'Available' : 'Not Available'}
          </Text>
        </View>

        <View style={styles.specsContainer}>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Color</Text>
            <Text style={styles.specValue}>{car.color}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Fuel Type</Text>
            <Text style={styles.specValue}>{car.fuelType}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Transmission</Text>
            <Text style={styles.specValue}>{car.transmission}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Seats</Text>
            <Text style={styles.specValue}>{car.seats}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>License Plate</Text>
            <Text style={styles.specValue}>{car.licensePlate}</Text>
          </View>
        </View>

        {car.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{car.description}</Text>
          </View>
        )}

        <View style={styles.bookingContainer}>
          <Text style={styles.bookingTitle}>Book This Car</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Pickup Date *</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY-MM-DD"
              value={pickupDate}
              onChangeText={setPickupDate}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Return Date *</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY-MM-DD"
              value={returnDate}
              onChangeText={setReturnDate}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Pickup Location *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter pickup location"
              value={pickupLocation}
              onChangeText={setPickupLocation}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Return Location *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter return location"
              value={returnLocation}
              onChangeText={setReturnLocation}
              placeholderTextColor="#999"
            />
          </View>

          {pickupDate && returnDate && (
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total ({calculateTotalDays()} days)</Text>
              <Text style={styles.totalAmount}>${calculateTotalAmount().toFixed(2)}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.bookButton,
              (!car.isAvailable || loading) && styles.bookButtonDisabled,
            ]}
            onPress={handleBookNow}
            disabled={!car.isAvailable || loading}>
            <Text style={styles.bookButtonText}>
              {loading ? 'Creating Booking...' : 'Book Now'}
            </Text>
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
  carImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  carTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dailyRate: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  available: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  specsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  specLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  descriptionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bookingContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CarDetailsScreen;
