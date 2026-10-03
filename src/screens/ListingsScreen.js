import { ActivityIndicator, FlatList, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useListings } from '../context/ListingContext';
import { listingStyles as styles } from './ListingsScreen.styles';
import { CITIES } from '../constants/cities';

const tabs = [
  { id: 'jobs', label: 'İş İlanları' },
  { id: 'workers', label: 'İş Arayan Usta/Çalışanlar' },
];

function ListingCard({ item, isWorker, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
    >
      {isWorker ? (
        <>
          <View style={styles.cardTop}>
            <View style={styles.cardTitleBlock}>
              <Text style={styles.cardTitle}>{item.fullName}</Text>
              <Text style={styles.occupation}>{item.occupation}</Text>
            </View>
            <Text style={styles.workerMeta}>{item.age} yaş</Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.locationDot} />
            <Text style={styles.metaText}>{item.city}</Text>
          </View>
          <Text numberOfLines={2} style={styles.areaText}>
            Çalışabileceği alanlar: {item.workAreas.join(', ')}
          </Text>
        </>
      ) : (
        <>
          <View style={styles.cardTop}>
            <View style={styles.cardTitleBlock}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.businessName}>{item.businessName}</Text>
            </View>
            <View style={styles.payBadge}>
              <Text style={styles.payValue}>{item.pay}</Text>
              <Text style={styles.payPeriod}>{item.payPeriod}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.metaRow}>
            <View style={styles.locationDot} />
            <Text style={styles.metaText}>{item.city}</Text>
          </View>
        </>
      )}
      <Text style={styles.cardAction}>Detayları gör  ›</Text>
    </Pressable>
  );
}

export default function ListingsScreen() {
  const router = useRouter();
  const { tab } = useLocalSearchParams();
  const { jobListings, workerListings, selectedCity, setCityFilter, fetchListings, refreshListings, isLoading, error } = useListings();
  const [isCityPickerVisible, setCityPickerVisible] = useState(false);
  const [citySearchText, setCitySearchText] = useState('');
  const matchingCities = CITIES.filter((city) =>
    city.toLocaleLowerCase('tr').includes(citySearchText.trim().toLocaleLowerCase('tr')),
  );
  const closeCityPicker = () => {
    setCityPickerVisible(false);
    setCitySearchText('');
  };
  const activeTab = tab === 'workers' ? 'workers' : 'jobs';
  const isWorkerTab = activeTab === 'workers';
  const data = isWorkerTab ? workerListings : jobListings;

  const openDetail = (item) => {
    router.push({
      pathname: '/detail',
      params: { type: isWorkerTab ? 'worker' : 'job', id: item.id },
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Ana sayfaya dön"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>İlanları İncele</Text>
            <Text style={styles.headerSubtitle}>Sana uygun fırsatları keşfet</Text>
          </View>
        </View>

        <View accessibilityRole="tablist" style={styles.tabBar}>
          {tabs.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => router.setParams({ tab: tab.id })}
                style={[styles.tab, selected && styles.activeTab]}
              >
                <Text style={[styles.tabText, selected && styles.activeTabText]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>{"\u015Eehir filtresi"}</Text>
          <View style={styles.filterControls}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={selectedCity || '\u0054\u00FCm \u015Eehirler'}
              onPress={() => {
                setCitySearchText('');
                setCityPickerVisible(true);
              }}
              style={[styles.cityPicker, styles.cityPickerExpanded]}
            >
              <Text numberOfLines={1} style={styles.cityPickerText}>{selectedCity || '\u0054\u00FCm \u015Eehirler'}</Text>
              <Text style={styles.cityPickerChevron}>{"\u2304"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => {
                console.log("Ara butonuna bas\u0131ld\u0131, aran\u0131yor:", selectedCity);
                fetchListings(selectedCity);
              }}
              style={styles.searchButton}
            >
              {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.searchButtonText}>Ara</Text>}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => {
              setCitySearchText('');
              setCityFilter('');
              fetchListings('');
            }}
            style={styles.clearFilterButton}
          >
            <Text style={styles.clearFilterText}>{"\u0054\u00FCm \u015Eehirleri G\u00F6ster"}</Text>
          </TouchableOpacity>
        </View>

        <Modal transparent visible={isCityPickerVisible} animationType="fade" onRequestClose={closeCityPicker}>
          <Pressable style={styles.modalBackdrop} onPress={closeCityPicker}>
            <View style={styles.cityPickerSheet}>
              <Text style={styles.cityPickerTitle}>{"\u015Eehir se\u00E7"}</Text>
              <TextInput
                accessibilityLabel={"\u015Eehir ara"}
                placeholder={"\u015Eehir ad\u0131n\u0131 yaz"}
                placeholderTextColor="#91A0B2"
                value={citySearchText}
                onChangeText={(value) => {
                  setCitySearchText(value);
                  setCityFilter(value);
                }}
                autoCapitalize="words"
                style={styles.citySearch}
              />
              <FlatList
                data={[{ key: '', label: '\u0054\u00FCm \u015Eehirler' }, ...matchingCities.map((city) => ({ key: city, label: city }))]}
                keyExtractor={(item) => item.key || 'all-cities'}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    accessibilityRole="button"
                    onPress={() => {
                      setCityFilter(item.key);
                      closeCityPicker();
                    }}
                    style={styles.cityOption}
                  >
                    <Text style={[styles.cityOptionText, selectedCity === item.key && styles.cityOptionSelected]}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyCities}>{"\u015Eehir listesi bulunamad\u0131."}</Text>}
              />
            </View>
          </Pressable>
        </Modal>

        <Text style={styles.resultCount}>
          {data.length} {isWorkerTab ? 'çalışan profili' : 'iş ilanı'}
        </Text>
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={refreshListings} style={styles.retryButton}>
              <Text style={styles.retryText}>Yeniden Dene</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={refreshListings}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator color="#16866F" size="large" style={styles.loading} />
            ) : (
              <Text style={styles.emptyText}>
                {error ? 'İlanlar yüklenemedi.' : 'Bu sekmede henüz ilan bulunmuyor.'}
              </Text>
            )
          }
          renderItem={({ item }) => (
            <ListingCard item={item} isWorker={isWorkerTab} onPress={() => openDetail(item)} />
          )}
        />
      </View>
    </View>
  );
}
