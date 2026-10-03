import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useListings } from '../context/ListingContext';
import FormField from '../components/FormField';
import CityPicker from '../components/CityPicker';
import PublishButton from '../components/PublishButton';
import ScreenHeader from '../components/ScreenHeader';
import { formStyles } from './forms.styles';

const payPeriods = ['Günlük', 'Aylık'];

export default function EmployerForm() {
  const router = useRouter();
  const { addJobListing } = useListings();
  const [form, setForm] = useState({
    businessName: '',
    phone: '',
    city: '',
    address: '',
    description: '',
    pay: '',
  });
  const [payPeriod, setPayPeriod] = useState('Günlük');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field) => (value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const publishListing = async () => {
    const requiredFields = [
      ['İşveren / İşletme Adı', form.businessName],
      ['Telefon Numarası', form.phone],
      ['Şehir', form.city],
      ['İş Yeri Adresi / Konumu', form.address],
      ['İş Açıklaması', form.description],
      ['Ücret', form.pay],
    ];
    const missingFields = requiredFields.filter(([, value]) => !value.trim()).map(([label]) => label);

    if (missingFields.length > 0) {
      Alert.alert('Eksik bilgi', `Lütfen şu alanları doldurun: ${missingFields.join(', ')}.`);
      return;
    }

    if (form.phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Telefon numarası hatalı', 'Telefon numarası en az 10 rakam içermelidir.');
      return;
    }

    const normalizedPay = form.pay
      .trim()
      .replace(/\.(?=\d{3}(?:\D|$))/g, '')
      .replace(',', '.');
    const numericPay = Number(normalizedPay);
    if (!Number.isFinite(numericPay) || numericPay <= 0) {
      Alert.alert('Ücret bilgisi hatalı', 'Lütfen sıfırdan büyük bir ücret girin.');
      return;
    }

    const description = form.description.trim();
    const title = description.split(/[.!?\n]/)[0].slice(0, 56) || 'Çalışan Aranıyor';

    setIsSubmitting(true);
    try {
      await addJobListing({
        title,
        businessName: form.businessName.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        description,
        pay: `${form.pay.trim()} TL`,
        payPeriod,
      });

      setForm({ businessName: '', phone: '', city: '', address: '', description: '', pay: '' });
      setPayPeriod('G\u00FCnl\u00FCk');
      Alert.alert('Ba\u015Far\u0131l\u0131', '\u0130lan\u0131n\u0131z ba\u015Far\u0131yla olu\u015Fturuldu!', [
        { text: 'Tamam', onPress: () => router.replace({ pathname: '/listings', params: { tab: 'jobs' } }) },
      ]);
    } catch (error) {
      Alert.alert('İş ilanı eklenemedi', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={formStyles.screen}>
      <KeyboardAvoidingView
        style={formStyles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={formStyles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader
            title="Çalışan ilanı"
            subtitle="İşini anlat, uygun çalışanlara ulaş."
            onBack={() => router.back()}
          />

          <View style={formStyles.introCard}>
            <View style={formStyles.introMark}>
              <Text style={formStyles.introMarkText}>U</Text>
            </View>
            <Text style={formStyles.introText}>
              İşletmen ve aradığın çalışan hakkında bilgileri paylaş.
            </Text>
          </View>

          <Text style={formStyles.sectionLabel}>İŞ YERİ BİLGİLERİ</Text>
          <FormField
            label="İşveren / İşletme Adı"
            placeholder="Örn. Yılmaz Oto Servis"
            value={form.businessName}
            onChangeText={updateField('businessName')}
            autoCapitalize="words"
          />
          <FormField
            label="Telefon Numarası"
            placeholder="05__ ___ __ __"
            value={form.phone}
            onChangeText={updateField('phone')}
            keyboardType="phone-pad"
            maxLength={15}
          />
          <CityPicker
            label={"\u015Eehir"}
            placeholder={"\u0130l se\u00E7in"}
            value={form.city}
            onValueChange={updateField('city')}
          />
          <FormField
            label="İş Yeri Adresi / Konumu"
            placeholder="Mahalle, cadde veya konum tarifi"
            value={form.address}
            onChangeText={updateField('address')}
            multiline
          />

          <Text style={formStyles.sectionLabel}>İŞ VE ÜCRET BİLGİLERİ</Text>
          <FormField
            label="İş Açıklaması"
            placeholder="Yapılacak işi ve aradığınız çalışanı anlatın"
            value={form.description}
            onChangeText={updateField('description')}
            multiline
          />
          <FormField
            label="Ücret"
            placeholder="Örn. 1.500"
            value={form.pay}
            onChangeText={updateField('pay')}
            keyboardType="decimal-pad"
            maxLength={10}
          />
          <Text style={formStyles.labelLike}>Ücret dönemi</Text>
          <View style={formStyles.choiceRow}>
            {payPeriods.map((period) => {
              const selected = payPeriod === period;
              return (
                <TouchableOpacity
                  key={period}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setPayPeriod(period)}
                  style={[formStyles.choice, selected && formStyles.choiceSelected]}
                >
                  <Text style={[formStyles.choiceText, selected && formStyles.choiceTextSelected]}>
                    {period}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <PublishButton
            title={isSubmitting ? 'Gönderiliyor…' : 'İş İlanı Yayımla'}
            onPress={publishListing}
            disabled={isSubmitting}
            loading={isSubmitting}
          />
          <Text style={formStyles.note}>
            İlanı yayımlamak için API sunucusu ve MongoDB bağlantısı açık olmalıdır.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
