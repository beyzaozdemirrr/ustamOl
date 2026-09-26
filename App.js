import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './App.styles';

const options = [
  {
    title: 'İş Arıyorum',
    description: 'Size uygun iş fırsatlarını keşfedin.',
    icon: '🔎',
    route: '/job-seeker',
    tone: 'blue',
  },
  {
    title: 'İşçi Arıyorum',
    description: 'İşletmeniz için doğru çalışanı bulun.',
    icon: '🤝',
    route: '/employer',
    tone: 'green',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.homeContent}>
        <View style={styles.topRow}>
          <View style={styles.logoMark}>
            <Text style={styles.logoMarkText}>U</Text>
          </View>
          <Text style={styles.brandName}>ustamol</Text>
          <View style={styles.versionPill}>
            <Text style={styles.versionText}>BETA</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>İŞİNİ BUL, USTANI BUL</Text>
          <Text style={styles.heading}>Doğru iş,{ '\n' }doğru insan.</Text>
          <Text style={styles.intro}>
            İş arayanlarla işverenleri tek bir yerde buluşturuyoruz.
            Başlamak için sana uygun seçeneği belirle.
          </Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={() => router.push('/listings')}
          style={styles.browseButton}
        >
          <Text style={styles.browseButtonText}>İlanları İncele</Text>
          <Text style={styles.browseArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.options}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.route}
              accessibilityRole="button"
              activeOpacity={0.82}
              onPress={() => router.push(option.route)}
              style={[styles.optionCard, option.tone === 'green' && styles.optionCardGreen]}
            >
              <View style={[styles.iconCircle, option.tone === 'green' && styles.iconCircleGreen]}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
              </View>
              <View style={styles.optionCopy}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerDot} />
          <Text style={styles.footerText}>Hemen başla, fırsatları kaçırma</Text>
        </View>
      </ScrollView>
    </View>
  );
}
