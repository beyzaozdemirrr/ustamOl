import { Text, TouchableOpacity } from 'react-native';
import { componentStyles } from './components.styles';

export default function PublishButton({ title, onPress, disabled = false }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      activeOpacity={disabled ? 1 : 0.85}
      disabled={disabled}
      onPress={onPress}
      style={[componentStyles.publishButton, disabled && componentStyles.publishButtonDisabled]}
    >
      <Text style={componentStyles.publishButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}
