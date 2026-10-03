import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CITIES } from '../constants/cities';
import { componentStyles } from './components.styles';

export default function CityPicker({ label, value, onValueChange, placeholder = '\u015Eehir se\u00E7in' }) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const filteredCities = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('tr');
    return CITIES.filter((city) => city.toLocaleLowerCase('tr').includes(normalizedQuery));
  }, [query]);

  const close = () => {
    setVisible(false);
    setQuery('');
  };

  return (
    <View style={componentStyles.field}>
      <Text style={componentStyles.label}>{label}</Text>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ expanded: visible }}
        onPress={() => {
          setQuery('');
          setVisible(true);
        }}
        style={componentStyles.cityPickerInput}
      >
        <Text style={[componentStyles.cityPickerValue, !value && componentStyles.cityPickerPlaceholder]}>
          {value || placeholder}
        </Text>
        <Text style={componentStyles.cityPickerChevron}>{"\u2304"}</Text>
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade" onRequestClose={close}>
        <View style={componentStyles.cityPickerModalRoot}>
          <Pressable accessibilityRole="button" accessibilityLabel="Kapat" onPress={close} style={componentStyles.cityPickerBackdrop} />
          <View style={componentStyles.cityPickerSheet}>
            <Text style={componentStyles.cityPickerTitle}>{label}</Text>
            <TextInput
              accessibilityLabel={"\u015Eehir ara"}
              placeholder={"\u0130l ad\u0131 yaz\u0131n"}
              placeholderTextColor="#91A0B2"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="words"
              style={componentStyles.cityPickerSearch}
            />
            <FlatList
              data={filteredCities}
              keyExtractor={(city) => city}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={{ selected: value === item }}
                  onPress={() => {
                    onValueChange(item);
                    close();
                  }}
                  style={componentStyles.cityPickerOption}
                >
                  <Text style={[componentStyles.cityPickerOptionText, value === item && componentStyles.cityPickerOptionSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={componentStyles.cityPickerEmpty}>{"E\u015Fle\u015Fen il bulunamad\u0131."}</Text>}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
