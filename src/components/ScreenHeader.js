import { Text, TouchableOpacity, View } from 'react-native';
import { componentStyles } from './components.styles';

export default function ScreenHeader({ title, subtitle, onBack }) {
  return (
    <View style={componentStyles.header}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Geri dön"
        onPress={onBack}
        style={componentStyles.backButton}
      >
        <Text style={componentStyles.backButtonText}>‹</Text>
      </TouchableOpacity>
      <View style={componentStyles.headerCopy}>
        <Text style={componentStyles.headerTitle}>{title}</Text>
        <Text style={componentStyles.headerSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}
