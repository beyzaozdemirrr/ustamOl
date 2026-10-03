import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useListings } from '../context/ListingContext';
import FormField from '../components/FormField';
import CityPicker from '../components/CityPicker';
import PublishButton from '../components/PublishButton';
import ScreenHeader from '../components/ScreenHeader';
import { formStyles } from './forms.styles';

export default function JobSeekerForm() {
  const router = useRouter();
  const { addWorkerListing } = useListings();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    age: '',
    city: '',
    occupation: '',
    workAreas: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field) => (value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const publishListing = async () => {
    const requiredFields = [
      ['Ad Soyad', form.fullName],
      ['Telefon Numarası', form.phone],
      ['Yaş', form.age],
      ['Şehir', form.city],
      ['Meslek', form.occupation],
      ['Çalışabileceğiniz İş Alanları', form.workAreas],
    ];
    const missingFields = requiredFields.filter(([, value]) => !value.trim()).map(([label]) => label);

    if (missingFields.length > 0) {
      Alert.alert('Eksik bilgi', `Lütfen şu alanları doldurun: ${missingFields.join(', ')}.`);
      return;
    }

    const phoneDigits = form.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      Alert.alert('Telefon numarası hatalı', 'Telefon numarası en az 10 rakam içermelidir.');
      return;
    }

    const age = Number(form.age);
    if (!Number.isInteger(age) || age < 16 || age > 100) {
      Alert.alert('Yaş bilgisi hatalı', 'Lütfen 16 ile 100 arasında geçerli bir yaş girin.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addWorkerListing({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        age,
        city: form.city.trim(),
        occupation: form.occupation.trim(),
        workAreas: form.workAreas.split(/[,;\n]/).map((area) => area.trim()).filter(Boolean),
        experience: 'Belirtilmedi',
        description: `${form.occupation.trim()} alanında iş arıyor.`,
      });

      setForm({ fullName: '', phone: '', age: '', city: '', occupation: '', workAreas: '' });
      Alert.alert('Ba\u015Far\u0131l\u0131', '\u0130lan\u0131n\u0131z ba\u015Far\u0131yla olu\u015Fturuldu!', [
        { text: 'Tamam', onPress: () => router.replace({ pathname: '/listings', params: { tab: 'workers' } }) },
      ]);
    } catch (error) {
      Alert.alert('İlan eklenemedi', error.message);
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
            title="İş arayan ilanı"
            subtitle="Kendini tanıt, sana uygun işlere ulaş."
            onBack={() => router.back()}
          />

          <View style={formStyles.introCard}>
            <View style={formStyles.introMark}>
              <Text style={formStyles.introMarkText}>U</Text>
            </View>
            <Text style={formStyles.introText}>
              Bilgilerini ekle, işverenler seni ve çalışma alanlarını tanısın.
            </Text>
          </View>

          <Text style={formStyles.sectionLabel}>KİŞİSEL BİLGİLER</Text>
          <FormField
            label="Ad Soyad"
            placeholder="Örn. Ayşe Yılmaz"
            value={form.fullName}
            onChangeText={updateField('fullName')}
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
          <FormField
            label="Yaş"
            placeholder="Yaşınızı girin"
            value={form.age}
            onChangeText={updateField('age')}
            keyboardType="number-pad"
            maxLength={2}
          />
          <CityPicker
            label={"Ya\u015Fad\u0131\u011F\u0131n\u0131z \u015Eehir"}
            placeholder={"\u0130l se\u00E7in"}
            value={form.city}
            onValueChange={updateField('city')}
          />

          <Text style={formStyles.sectionLabel}>İŞ DENEYİMİ VE TERCİHLER</Text>
          <FormField
            label="Yaptığınız Meslek"
            placeholder="Örn. Kaynak ustası"
            value={form.occupation}
            onChangeText={updateField('occupation')}
          />
          <FormField
            label="Çalışabileceğiniz İş Alanları"
            placeholder="Örn. Kaynak, montaj, bakım"
            value={form.workAreas}
            onChangeText={updateField('workAreas')}
            multiline
          />

          <PublishButton
            title={isSubmitting ? 'Gönderiliyor…' : 'İlanımı Yayımla'}
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
