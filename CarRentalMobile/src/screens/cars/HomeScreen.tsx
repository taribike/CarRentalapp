import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

import {Car} from '../../models/Car';
import ApiService from '../../services/ApiService';
import {RootStackParamList, TabParamList} from '../../../App';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPrice, setFilterPrice] = useState('');

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    filterCars();
  }, [cars, searchQuery, filterPrice]);

  const loadCars = async () => {
    try {
      const carsData = await ApiService.getAllCars();
      setCars(carsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load cars');
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCars();
    setRefreshing(false);
  };

  const filterCars = () => {
    let filtered = cars.filter(car => car.isAvailable);

    // Filter by search query (make, model, or color)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        car =>
          car.make.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.color.toLowerCase().includes(query),
      );
    }

    // Filter by price
    if (filterPrice) {
      const maxPrice = parseFloat(filterPrice);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(car => car.dailyRate <= maxPrice);
      }
    }

    setFilteredCars(filtered);
  };

  const handleCarPress = (car: Car) => {
    navigation.navigate('CarDetails', {car});
  };

  const renderCarItem = ({item}: {item: Car}) => (
    <TouchableOpacity style={styles.carCard} onPress={() => handleCarPress(item)}>
      <Image
        source={
          item.imageUrl
            ? {uri: item.imageUrl}
            : require('../../../assets/placeholder-car.png')
        }
        style={styles.carImage}
        defaultSource={require('../../../assets/placeholder-car.png')}
      />
      <View style={styles.carInfo}>
        <Text style={styles.carTitle}>
          {item.year} {item.make} {item.model}
        </Text>
        <Text style={styles.carDetails}>
          {item.color} • {item.fuelType} • {item.transmission}
        </Text>
        <Text style={styles.carSeats}>{item.seats} seats</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.dailyRate}>${item.dailyRate}/day</Text>
          <Text style={styles.available}>Available</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No cars available</Text>
      <Text style={styles.emptyStateSubtext}>
        Try adjusting your search criteria
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Cars</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by make, model, or color..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.priceInput}
          placeholder="Max price/day"
          value={filterPrice}
          onChangeText={setFilterPrice}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredCars}
        renderItem={renderCarItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  priceInput: {
    width: 120,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  listContainer: {
    padding: 15,
  },
  carCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  carImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  carInfo: {
    padding: 15,
  },
  carTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  carDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  carSeats: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyRate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  available: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default HomeScreen;
