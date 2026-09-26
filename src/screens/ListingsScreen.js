import { ActivityIndicator, FlatList, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useListings } from '../context/ListingContext';
import { listingStyles as styles } from './ListingsScreen.styles';

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
  const { jobListings, workerListings, isLoading, error, refreshListings } = useListings();
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
