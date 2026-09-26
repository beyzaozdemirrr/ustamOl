import { Text, TextInput, View } from 'react-native';
import { componentStyles } from './components.styles';

export default function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  maxLength,
  autoCapitalize = 'sentences',
}) {
  return (
    <View style={componentStyles.field}>
      <Text style={componentStyles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        style={[componentStyles.input, multiline && componentStyles.multilineInput]}
        placeholder={placeholder}
        placeholderTextColor="#91A0B2"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        returnKeyType={multiline ? 'default' : 'next'}
      />
    </View>
  );
}
