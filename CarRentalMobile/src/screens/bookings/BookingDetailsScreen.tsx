import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import {Booking, BookingStatus} from '../../models/Booking';
import {RootStackParamList} from '../../../App';
import ApiService from '../../services/ApiService';

type BookingDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BookingDetails'
>;

type BookingDetailsScreenRouteProp = RouteProp<RootStackParamList, 'BookingDetails'>;

interface Props {
  navigation: BookingDetailsScreenNavigationProp;
  route: BookingDetailsScreenRouteProp;
}

const BookingDetailsScreen: React.FC<Props> = ({navigation, route}) => {
  const {booking} = route.params;
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Pending:
        return '#FFA500';
      case BookingStatus.Confirmed:
        return '#007AFF';
      case BookingStatus.Active:
        return '#4CAF50';
      case BookingStatus.Completed:
        return '#666';
      case BookingStatus.Cancelled:
        return '#F44336';
      default:
        return '#666';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: confirmCancelBooking,
        },
      ],
    );
  };

  const confirmCancelBooking = async () => {
    setLoading(true);
    try {
      await ApiService.cancelBooking(booking.id);
      Alert.alert('Success', 'Booking has been cancelled');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel booking');
      console.error('Error cancelling booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = () => {
    navigation.navigate('Payment', {booking});
  };

  const canCancel = booking.status === BookingStatus.Pending || booking.status === BookingStatus.Confirmed;
  const canPay = booking.status === BookingStatus.Pending;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Booking Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.sectionTitle}>Booking Status</Text>
          <View style={[styles.statusBadge, {backgroundColor: getStatusColor(booking.status)}]}>
            <Text style={styles.statusText}>{booking.status}</Text>
          </View>
        </View>

        {/* Car Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Car Information</Text>
          <Text style={styles.carInfo}>{booking.carInfo}</Text>
        </View>

        {/* Booking Dates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Dates</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Pickup Date</Text>
              <Text style={styles.dateValue}>{formatDate(booking.pickupDate)}</Text>
              <Text style={styles.locationText}>{booking.pickupLocation}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Return Date</Text>
              <Text style={styles.dateValue}>{formatDate(booking.returnDate)}</Text>
              <Text style={styles.locationText}>{booking.returnLocation}</Text>
            </View>
          </View>
          <View style={styles.durationContainer}>
            <Text style={styles.durationLabel}>Total Duration</Text>
            <Text style={styles.durationValue}>{booking.totalDays} days</Text>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Daily Rate</Text>
            <Text style={styles.pricingValue}>${booking.dailyRate}/day</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Duration</Text>
            <Text style={styles.pricingValue}>{booking.totalDays} days</Text>
          </View>
          <View style={[styles.pricingRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${booking.totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking ID</Text>
            <Text style={styles.detailValue}>{booking.id}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created</Text>
            <Text style={styles.detailValue}>{formatDateTime(booking.createdAt)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last Updated</Text>
            <Text style={styles.detailValue}>{formatDateTime(booking.updatedAt)}</Text>
          </View>
          {booking.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.notesText}>{booking.notes}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {canPay && (
            <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          )}
          
          {canCancel && (
            <TouchableOpacity
              style={[styles.cancelButton, loading && styles.disabledButton]}
              onPress={handleCancelBooking}
              disabled={loading}>
              <Text style={styles.cancelButtonText}>
                {loading ? 'Cancelling...' : 'Cancel Booking'}
              </Text>
            </TouchableOpacity>
          )}
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
  statusContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  carInfo: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  durationContainer: {
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  durationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  durationValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  totalRow: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginTop: 8,
  },
  pricingLabel: {
    fontSize: 14,
    color: '#666',
  },
  pricingValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  notesContainer: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    lineHeight: 20,
  },
  actionsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default BookingDetailsScreen;
