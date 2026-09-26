import { useMemo } from 'react';
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useListings } from '../context/ListingContext';
import { detailStyles as styles } from './DetailScreen.styles';

function DetailField({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

export default function DetailScreen() {
  const router = useRouter();
  const { type, id } = useLocalSearchParams();
  const { jobListings, workerListings } = useListings();
  const isWorker = type === 'worker';
  const listing = useMemo(() => {
    const listings = isWorker ? workerListings : jobListings;
    return listings.find((item) => item.id === id);
  }, [id, isWorker, jobListings, workerListings]);

  const callListingOwner = async () => {
    if (!listing?.phone) return;

    try {
      await Linking.openURL(`tel:${listing.phone}`);
    } catch {
      Alert.alert('Arama açılamadı', 'Bu cihazda telefon araması başlatılamadı.');
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="İlan listesine dön"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{isWorker ? 'Çalışan Profili' : 'İş İlanı'}</Text>
            <Text style={styles.headerSubtitle}>İlan detayları</Text>
          </View>
        </View>

        {!listing ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Bu ilan bulunamadı. Listeye dönüp başka bir ilan seçebilirsin.</Text>
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.body}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.heroCard}>
                <Text style={styles.title}>{isWorker ? listing.fullName : listing.title}</Text>
                <Text style={styles.subtitle}>
                  {isWorker ? listing.occupation : listing.businessName}
                </Text>
                <Text style={styles.location}>⌖  {listing.city}</Text>
                {!isWorker && (
                  <Text style={styles.pay}>{listing.pay} / {listing.payPeriod.toLowerCase()}</Text>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{isWorker ? 'Çalışan Bilgileri' : 'İş Yeri Bilgileri'}</Text>
                {isWorker ? (
                  <>
                    <DetailField label="Yaş" value={`${listing.age}`} />
                    <DetailField label="Deneyim" value={listing.experience} />
                  </>
                ) : (
                  <DetailField label="İş yeri adresi / konumu" value={listing.address} />
                )}
                <DetailField label="Şehir" value={listing.city} />
              </View>

              {isWorker && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Çalışabileceği Alanlar</Text>
                  <Text style={styles.areas}>{listing.workAreas.join(' · ')}</Text>
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{isWorker ? 'Hakkında' : 'İş Açıklaması'}</Text>
                <Text style={styles.fieldValue}>{listing.description}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={callListingOwner}
              style={styles.callButton}
            >
              <Text style={styles.callIcon}>☎</Text>
              <Text style={styles.callText}>Telefonla Ara</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
