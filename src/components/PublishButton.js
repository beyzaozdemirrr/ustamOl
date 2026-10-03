import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { componentStyles } from './components.styles';

export default function PublishButton({ title, onPress, disabled = false, loading = false }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      activeOpacity={disabled ? 1 : 0.85}
      disabled={disabled}
      onPress={onPress}
      style={[componentStyles.publishButton, disabled && componentStyles.publishButtonDisabled]}
    >
      <View style={componentStyles.publishButtonContent}>
        {loading && <ActivityIndicator color="#FFFFFF" size="small" />}
        <Text style={componentStyles.publishButtonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
