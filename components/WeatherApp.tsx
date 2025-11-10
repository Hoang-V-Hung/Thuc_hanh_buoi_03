import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const API_KEY = 'a051f8d4be0fea3f0842474990dd6513';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface WeatherMain {
    temp: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
}
interface WeatherInfo {
    main: string;
    description: string;
    icon: string;
}
interface Wind {
    speed: number;
}
interface CurrentWeatherResponse {
    name: string;
    main: WeatherMain;
    weather: WeatherInfo[];
    wind: Wind;
}
interface ForecastItem {
    dt_txt: string;
    main: WeatherMain;
    weather: WeatherInfo[];
}
interface ForecastResponse {
    list: ForecastItem[];
}

const toTitleCase = (str: string) => {
    return str.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
};

const getWeatherEmoji = (iconCode: string) => {
    switch (iconCode) {
        case '01d': return '☀️'; 
        case '01n': return '🌙'; 
        case '02d': return '⛅'; 
        case '02n': return '☁️'; 
        case '03d': case '03n': case '04d': case '04n': return '☁️'; 
        case '09d': return '🌧️'; 
        case '10d': return '🌦️'; 
        case '09n': case '10n': return '🌧️'; 
        case '11d': case '11n': return '⛈️'; 
        case '13d': case '13n': return '❄️'; 
        case '50d': case '50n': return '🌫️'; 
        default: return '🌡️';
    }
};

// --- Theme (Định nghĩa bên ngoài) ---
interface WeatherTheme {
    bg: string;
    text: string;
    cardBg: string; 
    cardText: string;
    textDim: string;
    border: string;
    barBg: string;
}

const defaultTheme: WeatherTheme = {
    bg: '#080c24', 
    text: '#ffffff', 
    cardBg: 'rgba(255, 255, 255, 0.1)',
    cardText: '#ffffff',
    textDim: 'rgba(255, 255, 255, 0.6)', 
    border: 'rgba(255, 255, 255, 0.2)', 
    barBg: 'rgba(255, 255, 255, 0.2)', 
};

const getWeatherTheme = (iconCode: string): WeatherTheme => {
    switch (iconCode) {
        case '01d': 
            return { ...defaultTheme, bg: '#4a90e2' };
        case '01n': 
            return { ...defaultTheme, bg: '#080c24' };
        case '02d': 
        case '03d':
        case '04d':
            return { ...defaultTheme, bg: '#54717a' };
        default:
            return defaultTheme;
    }
};

export default function WeatherApp() {
    const [searchQuery, setSearchQuery] = useState("");
    const [displayedCity, setDisplayedCity] = useState("Hà Nội");
    const [currentWeather, setCurrentWeather] = useState<CurrentWeatherResponse | null>(null);
    const [hourlyForecast, setHourlyForecast] = useState<ForecastItem[]>([]);
    const [dailyForecast, setDailyForecast] = useState<ForecastItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<WeatherTheme>(defaultTheme); 
    
    const MIN_TEMP_RANGE = 0;
    const MAX_TEMP_RANGE = 40;
    const TOTAL_TEMP_RANGE = MAX_TEMP_RANGE - MIN_TEMP_RANGE;

    const fetchWeatherData = async (city: string) => {
        if (!city) return;
        setLoading(true);
        setError(null);
        setCurrentWeather(null);
        setHourlyForecast([]);
        setDailyForecast([]);
        setTheme(defaultTheme); 
        
        const cityToDisplay = toTitleCase(city);
        const currentWeatherUrl = `${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=vi`;
        const forecastUrl = `${API_BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=vi`;

        try {
            const [currentRes, forecastRes] = await Promise.all([
                axios.get(currentWeatherUrl),
                axios.get(forecastUrl)
            ]);
            const currentData: CurrentWeatherResponse = currentRes.data;
            const forecastData: ForecastResponse = forecastRes.data;
            setCurrentWeather(currentData);
            setHourlyForecast(forecastData.list.slice(0, 8));

            const today = new Date();
            const todayString = today.toDateString();
            const daily = forecastData.list.filter(item => {
                const isNoon = item.dt_txt.endsWith('12:00:00');
                if (!isNoon) return false;
                const itemDate = new Date(item.dt_txt);
                return itemDate.toDateString() !== todayString;
            });
            
            setDailyForecast(daily);
            setDisplayedCity(cityToDisplay);
            setTheme(getWeatherTheme(currentData.weather[0].icon));

        } catch (e: any) {
            let errorMessage = 'Đã xảy ra lỗi...';
            if (axios.isAxiosError(e) && e.response?.status === 404) {
                errorMessage = 'Không tìm thấy thành phố.';
            }
            setError(errorMessage);
            Alert.alert("Lỗi", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeatherData("Hà Nội");
    }, []);

    const handleSearch = () => {
        const cityToSearch = searchQuery.trim();
        if (cityToSearch) {
            fetchWeatherData(cityToSearch);
        } else {
            Alert.alert("Thông báo", "Vui lòng nhập tên thành phố.");
        }
    };

    const formatForecastDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { weekday: 'short' });
    };


    const renderHourlyItem = ({ item, index }: { item: ForecastItem, index: number }) => {
        const date = new Date(item.dt_txt);
        const hour = date.toLocaleTimeString('vi-VN', { hour: '2-digit', hourCycle: 'h23' });
        const temp = Math.round(item.main.temp);
        const timeLabel = index === 0 ? "Bây giờ" : `${hour}h`;

        return (
            <View style={styles.hourlyItem}>
                <Text style={[styles.hourlyTime, { color: theme.text }]}>{timeLabel}</Text>
                <Text style={[styles.hourlyIcon, { color: theme.text }]}>{getWeatherEmoji(item.weather[0].icon)}</Text>
                <Text style={[styles.hourlyTemp, { color: theme.text }]}>{temp}°</Text>
            </View>
        );
    };

    const renderDailyItem = ({ item }: { item: ForecastItem }) => {
        const lowTemp = Math.round(item.main.temp_min); 
        const highTemp = Math.round(item.main.temp_max);
        
        const lowPercent = Math.max(0, ((lowTemp - MIN_TEMP_RANGE) / TOTAL_TEMP_RANGE) * 100);
        const highPercent = Math.min(100, ((highTemp - MIN_TEMP_RANGE) / TOTAL_TEMP_RANGE) * 100);
        const barWidth = Math.max(5, highPercent - lowPercent);

        return (
            <View style={styles.dailyItem}>
                <Text style={[styles.dailyText, { color: theme.text, flex: 2 }]}>
                    {formatForecastDate(item.dt_txt)}
                </Text>
                <Text style={[styles.dailyText, styles.dailyIcon, { color: theme.text, flex: 1 }]}>
                    {getWeatherEmoji(item.weather[0].icon)}
                </Text>
                <Text style={[styles.dailyText, { color: theme.textDim, flex: 1 }]}>
                    {lowTemp}°
                </Text>
                <View style={[styles.tempBarContainer, { backgroundColor: theme.barBg }]}>
                    <View style={[
                        styles.tempBar, 
                        { 
                            marginLeft: `${lowPercent}%`, 
                            width: `${barWidth}%` 
                        }
                    ]} />
                </View>
                <Text style={[styles.dailyText, { color: theme.text, flex: 1, textAlign: 'right' }]}>
                    {highTemp}° 
                </Text>
            </View>
        );
    };
    

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContainer}
            >
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm thành phố..."
                        placeholderTextColor="#9ca3af"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                        onSubmitEditing={handleSearch}
                    />
                </View>

                {loading && (
                    <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 50 }} />
                )}

                {error && !loading && (
                    <Text style={[styles.errorText, { color: '#f87171' }]}>{error}</Text>
                )}

                {currentWeather && !loading && (
                    <View style={styles.contentWrapper}>
                        <View style={styles.currentWeatherContainer}>
                            <Text style={[styles.cityName, { color: theme.text }]}>{displayedCity}</Text>
                            <Text style={[styles.temperature, { color: theme.text }]}>
                                {Math.round(currentWeather.main.temp)}°
                            </Text>
                            <Text style={[styles.description, { color: theme.textDim }]}>
                                {currentWeather.weather[0].description}
                            </Text>
                            <Text style={[styles.highLow, { color: theme.text }]}>
                                C: {Math.round(currentWeather.main.temp_max)}°  T: {Math.round(currentWeather.main.temp_min)}°
                            </Text>
                        </View>

                        {hourlyForecast.length > 0 && (
                            <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
                                <Text style={[styles.cardTitle, { color: theme.textDim, borderBottomColor: theme.border }]}>
                                    DỰ BÁO HÀNG GIỜ
                                </Text>
                                <FlatList
                                    data={hourlyForecast}
                                    renderItem={renderHourlyItem}
                                    keyExtractor={item => item.dt_txt}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View>
                        )}
                        
                        {dailyForecast.length > 0 && (
                            <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
                                <Text style={[styles.cardTitle, { color: theme.textDim, borderBottomColor: theme.border }]}>
                                    DỰ BÁO 5 NGÀY
                                </Text>
                                <FlatList
                                    data={dailyForecast}
                                    renderItem={renderDailyItem}
                                    keyExtractor={item => item.dt_txt}
                                    scrollEnabled={false}
                                />
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        paddingVertical: 16,
        paddingBottom: 40,
    },
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    searchInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#ffffff', 
        borderRadius: 12,
        paddingVertical: Platform.OS === 'android' ? 10 : 14,
        paddingHorizontal: 20,
        fontSize: 16,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    contentWrapper: {
        paddingHorizontal: 16,
        gap: 16,
    },
    currentWeatherContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    cityName: {
        fontSize: 34,
        fontWeight: '700',
    },
    temperature: {
        fontSize: 96,
        fontWeight: '100',
        lineHeight: 110,
    },
    description: {
        fontSize: 20,
        fontWeight: '500',
    },
    highLow: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 4,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        overflow: 'hidden', 
    },
    cardTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
    },
    hourlyItem: {
        width: 70,
        alignItems: 'center',
        gap: 12,
    },
    hourlyTime: {
        fontWeight: '600',
        fontSize: 15,
    },
    hourlyIcon: {
        fontSize: 28,
    },
    hourlyTemp: {
        fontWeight: '700',
        fontSize: 18,
    },
    dailyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dailyText: {
        fontSize: 18, 
        fontWeight: '500',
    },
    dailyIcon: {
        fontSize: 22, 
        textAlign: 'center',
    },
    tempBarContainer: {
        flex: 3, 
        height: 5,
        borderRadius: 5,
        marginHorizontal: 12,
    },
    tempBar: {
        height: 5,
        borderRadius: 5,
        backgroundColor: '#f97316', 
    },
});